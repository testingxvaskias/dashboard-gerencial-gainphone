import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// @ts-ignore
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL?.replace("file:", "") || "C:/Users/ANDREY/OneDrive/Escritorio/dashboard-eljuri/dev.db" });
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      model_version,
      intent,
      sentiment,
      sentiment_score,
      contained,
      satisfaction,
      ai_precision,
      latency_ms,
      tokens_used,
      churn_risk
    } = data;

    // Validate essential fields
    if (!model_version || !intent || !sentiment || typeof latency_ms !== 'number') {
      return NextResponse.json(
        { error: 'Missing required telemetry fields' },
        { status: 400 }
      );
    }

    // Insert to shared database
    const interaction = await prisma.modelInteraction.create({
      data: {
        model_version,
        intent,
        sentiment,
        sentiment_score: sentiment_score || 0,
        contained: Boolean(contained),
        satisfaction: satisfaction !== undefined ? Boolean(satisfaction) : null,
        ai_precision: Boolean(ai_precision),
        latency_ms,
        tokens_used: tokens_used || 0,
        churn_risk: Boolean(churn_risk),
      },
    });

    return NextResponse.json(
      { success: true, interactionId: interaction.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
