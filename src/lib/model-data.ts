import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

export const dynamic = "force-dynamic";

// @ts-ignore
const adapter = new PrismaBetterSqlite3({ url: (process.env.DATABASE_URL || "file:./prisma/dev.db").replace("file:", "") });
const prisma = new PrismaClient({ adapter });

export async function getModelDashboardData() {
  const totalInteractions = await prisma.modelInteraction.count();

  if (totalInteractions === 0) {
    return null;
  }

  const containedCount = await prisma.modelInteraction.count({ where: { contained: true } });
  const satisfactionCount = await prisma.modelInteraction.count({ where: { satisfaction: true } });
  const precisionCount = await prisma.modelInteraction.count({ where: { ai_precision: true } });
  const churnRiskCount = await prisma.modelInteraction.count({ where: { churn_risk: true } });

  const agg = await prisma.modelInteraction.aggregate({
    _avg: {
      latency_ms: true,
      sentiment_score: true,
    },
  });

  const topIntents = await prisma.modelInteraction.groupBy({
    by: ["intent"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const sentiments = await prisma.modelInteraction.groupBy({
    by: ["sentiment"],
    _count: { id: true },
  });

  const modelStats = await prisma.modelInteraction.groupBy({
    by: ["model_version"],
    _count: { id: true },
    _avg: {
      latency_ms: true,
      tokens_used: true,
    },
  });

  const modelContainmentV1 = await prisma.modelInteraction.count({ where: { model_version: "v1-Legacy", contained: true } });
  const modelContainmentV2 = await prisma.modelInteraction.count({ where: { model_version: "v2-Advanced", contained: true } });
  const v1Count = modelStats.find((s: any) => s.model_version === "v1-Legacy")?._count.id || 0;
  const v2Count = modelStats.find((s: any) => s.model_version === "v2-Advanced")?._count.id || 0;

  return {
    overview: {
      total: totalInteractions,
      containmentRate: (containedCount / totalInteractions) * 100,
      satisfactionRate: (satisfactionCount / totalInteractions) * 100,
      precisionRate: (precisionCount / totalInteractions) * 100,
      churnRiskCount: churnRiskCount,
      churnRiskRate: (churnRiskCount / totalInteractions) * 100,
      avgLatencyMs: Math.round(agg._avg.latency_ms || 0),
      avgSentimentScore: agg._avg.sentiment_score || 0,
    },
    topIntents: topIntents.map((i: any) => ({ intent: i.intent, count: i._count.id })),
    sentiments: sentiments.map((s: any) => ({ sentiment: s.sentiment, count: s._count.id })),
    modelComparison: modelStats.map((s: any) => ({
      version: s.model_version,
      interactions: s._count.id,
      interactionShare: (s._count.id / totalInteractions) * 100,
      avgLatency: Math.round(s._avg.latency_ms || 0),
      avgTokens: Math.round(s._avg.tokens_used || 0),
      containmentRate: s.model_version === "v1-Legacy" 
        ? (modelContainmentV1 / (v1Count || 1)) * 100 
        : (modelContainmentV2 / (v2Count || 1)) * 100,
    })).sort((a: any, b: any) => b.version.localeCompare(a.version)), // v2 first
  };
}
