const Database = require("better-sqlite3");
const crypto = require("crypto");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL.replace("file:", "");
const db = new Database(dbUrl);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBool(trueChance = 0.5) {
  return Math.random() < trueChance;
}

console.log("Clearing ModelInteraction data...");
db.exec('DELETE FROM "ModelInteraction"');

console.log("Seeding 236 ModelInteractions...");
const insert = db.prepare(
  'INSERT INTO "ModelInteraction" (id, model_version, intent, sentiment, sentiment_score, contained, satisfaction, ai_precision, latency_ms, tokens_used, churn_risk, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

const intents = ["Info General", "Churn Risk", "Upgrade/Ventas", "Verificar Estado", "Disputas Cobro"];

db.transaction(() => {
  for (let i = 0; i < 236; i++) {
    const isV2 = randomBool(0.6);
    const modelVersion = isV2 ? "v2-Advanced" : "v1-Legacy";
    const intent = randomPick(intents);
    
    const sentimentRand = Math.random();
    let sentiment = "Neutral";
    if (sentimentRand < 0.3) sentiment = "Positivo";
    else if (sentimentRand < 0.7) sentiment = "Negativo";

    const sentimentScore = sentiment === "Positivo" ? Math.random() : (sentiment === "Negativo" ? -Math.random() : 0);

    const latencyMs = isV2 ? randomInt(400, 600) : randomInt(1100, 1800);
    const tokensUsed = isV2 ? randomInt(100, 200) : randomInt(250, 450);
    // Prisma stores boolean as 1/0 or true/false? Prisma stores Boolean as 1/0 in SQLite
    const contained = isV2 ? randomBool(0.62) : randomBool(0.28);
    const aiPrecision = isV2 ? randomBool(0.95) : randomBool(0.80);
    
    const satisfaction = sentiment === "Positivo" ? true : (sentiment === "Negativo" ? false : randomBool(0.5));
    const churnRisk = randomBool(0.14);
    
    // SQLite dates in Prisma are integer unix ms
    const timestamp = new Date(Date.now() - randomInt(0, 1000000000)).getTime();

    insert.run(
      crypto.randomUUID(),
      modelVersion,
      intent,
      sentiment,
      sentimentScore,
      contained ? 1 : 0,
      satisfaction ? 1 : 0,
      aiPrecision ? 1 : 0,
      latencyMs,
      tokensUsed,
      churnRisk ? 1 : 0,
      timestamp
    );
  }
})();

console.log("Seed complete!");
db.close();
