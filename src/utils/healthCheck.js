const redis = require("./redisConfig");
const services = [
  { key: "service:A:url", url: `${process.env.PROCESSOR_DEFAULT_URL}/payments/service-health`, baseUrl: process.env.PROCESSOR_DEFAULT_URL },
  { key: "service:B:url", url: `${process.env.PROCESSOR_FALLBACK_URL}/payments/service-health`, baseUrl: process.env.PROCESSOR_FALLBACK_URL }
];

async function checkServices() {
  for (const service of services) {
    try {
      console.log("[PROCESSANDO HEALTH CHECK]");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout

      const res = await fetch(service.url, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Erro no fetch");

      const data = await res.json();

      if (data.failing === false) {
        await redis.set(service.key, service.baseUrl, { EX: 10 });
        console.log(`✅ ${service.baseUrl} online`);
      } else {
        await redis.del(service.key);
        console.log(`❌ ${service.baseUrl} marcado como offline (failing)`);
      }
    } catch (err) {
      await redis.del(service.key);
      console.log(`❌ ${service.baseUrl} offline: ${err.message}`);
    }
  }
}

async function getActiveUrl(serviceKey) {
  const url = await redis.get(serviceKey);
  return url || null; // null = offline
}

async function returnFirstServiceOn(serviceKey1, serviceKey2){
    return process.env.PROCESSOR_DEFAULT_URL;
}

module.exports = {checkServices, getActiveUrl, returnFirstServiceOn}