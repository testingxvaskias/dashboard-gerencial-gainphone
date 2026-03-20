require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBool(trueChance = 0.5) {
  return Math.random() < trueChance;
}

async function seedModelInteractions(count) {
  console.log(`Seeding ${count} ModelInteractions...`)
  const intents = ["Info General", "Churn Risk", "Upgrade/Ventas", "Verificar Estado", "Disputas Cobro"]
  
  for (let i = 0; i < count; i++) {
    const isV2 = randomBool(0.6)
    const modelVersion = isV2 ? "v2-Advanced" : "v1-Legacy"
    const intent = randomPick(intents)
    
    const sentimentRand = Math.random()
    let sentiment = "Neutral"
    if (sentimentRand < 0.3) sentiment = "Positivo"
    else if (sentimentRand < 0.7) sentiment = "Negativo"

    const sentimentScore = sentiment === "Positivo" ? Math.random() : (sentiment === "Negativo" ? -Math.random() : 0)

    const latencyMs = isV2 ? randomInt(400, 600) : randomInt(1100, 1800)
    const tokensUsed = isV2 ? randomInt(100, 200) : randomInt(250, 450)
    const contained = isV2 ? randomBool(0.62) : randomBool(0.28)
    const aiPrecision = isV2 ? randomBool(0.95) : randomBool(0.80)
    
    const satisfaction = sentiment === "Positivo" ? true : (sentiment === "Negativo" ? false : randomBool(0.5))
    const churnRisk = randomBool(0.14)

    await prisma.modelInteraction.create({
      data: {
        model_version: modelVersion,
        intent: intent,
        sentiment: sentiment,
        sentiment_score: sentimentScore,
        contained: contained,
        satisfaction: satisfaction,
        ai_precision: aiPrecision,
        latency_ms: latencyMs,
        tokens_used: tokensUsed,
        churn_risk: churnRisk,
        timestamp: new Date(Date.now() - randomInt(0, 1000000000)),
      },
    })
  }
  console.log(`  ✓ ${count} ModelInteractions created`)
}

async function main() {
  console.log("Clearing existing ModelInteraction data...")
  await prisma.modelInteraction.deleteMany()
  await seedModelInteractions(236)
  console.log("\nSeed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
