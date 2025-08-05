const redis = require("./redisConfig");

const DEFAULT_URL = process.env.PROCESSOR_DEFAULT_URL;
const FALLBACK_URL = process.env.PROCESSOR_FALLBACK_URL;
const MAX_FAILS_BEFORE_OFFLINE = 2;

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 16).replace(/[-T:]/g, "");
}

async function trySend(payload, url, origin) {
  

  // try {
  //   const res = await fetch(`${url}/payments`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //     signal: controller.signal,
  //   });

  //   clearTimeout(timeout);
  //   const text = await res.text();
  //   let response;

  //   try {
  //     response = JSON.parse(text);
  //   } catch {
  //     response = { message: text };
  //   }

  //   if (res.ok) {
  //     const summaryKey = `summary:${origin}:${getDateKey()}`;
  //     await redis.hIncrBy(summaryKey, "totalRequests", 1);
  //     await redis.hIncrByFloat(summaryKey, "totalAmount", Number(payload.amount));
  //     await redis.expire(summaryKey, 60 * 60 * 24 * 7);
  //     await redis.set(`correlation:${payload.correlationId}`, "ok", { EX: 300 });

  //     // ✅ Resetar contador de falhas
  //     await redis.del(`fail_count:${origin}`);
  //     return { success: true };
  //   }

  //   if (response?.message?.includes("CorrelationId already exists")) {
  //     console.warn(`[⚠️ DESCARTADO] CorrelationId duplicado: ${payload.correlationId}`);
  //     return { success: false, discard: true };
  //   }

  //   console.error(`[❌ HTTP ${res.status}] ${url}`);
  //   return { success: false };
  // } catch (err) {
  //   clearTimeout(timeout);
  //   console.error(`[💥 EXCEPTION] Falha no envio para ${url}: ${err.message}`);

  //   // 🔄 Incrementa contador de falha
  //   const failKey = `fail_count:${origin}`;
  //   const newCount = await redis.incr(failKey);
  //   await redis.expire(failKey, 10); // Expira em 10s (janela de tempo curta)

  //   if (newCount >= MAX_FAILS_BEFORE_OFFLINE) {
  //     await redis.set(`service_offline:${origin}`, "1", { EX: 5 });
  //     console.warn(`[⛔ OFFLINE] Marcando ${origin} como offline após ${newCount} falhas`);
  //   }

  //   return { success: false };
  // }

  try {
    
  } catch (error) {
    
  }

}

async function dispatchPayment(payload, forcedUrl = null) {
  const isDefaultOffline = await redis.exists("service_offline:default");
  const isFallbackOffline = await redis.exists("service_offline:fallback");

  if(!isDefaultOffline){
    trySend(payload, DEFAULT_URL);
    return;
  }

  if(!isFallbackOffline){
    trySend(payload, FALLBACK_URL)
  }

}

module.exports = { dispatchPayment, getDateKey };
