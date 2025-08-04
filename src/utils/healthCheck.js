const axios = require("axios");
const redis = require("./redisConfig");

const services = [
  { key: "service:A:url", url: `${process.env.PROCESSOR_DEFAULT_URL}/payments/service-health`, baseUrl: process.env.PROCESSOR_DEFAULT_URL },
  { key: "service:B:url", url: `${process.env.PROCESSOR_FALLBACK_URL}/payments/service-health`, baseUrl: process.env.PROCESSOR_FALLBACK_URL }
];

async function checkServices() {
  for (const service of services) {
    try {
        console.log("[PROCESSANDO HEALTH CHECK]")
      const res = await axios.get(service.url, { timeout: 2000 });
      if (res.status === 200) {
        await redis.set(service.key, service.baseUrl, {
          EX: 10 // ✅ Agora o TTL é passado como objeto
        });
        console.log(`✅ ${service.baseUrl} online`);
      }
    } catch {
      await redis.del(service.key);
      console.log(`❌ ${service.baseUrl} offline`);
    }
  }
}

async function getActiveUrl(serviceKey) {
  const url = await redis.get(serviceKey);
  return url || null; // null = offline
}

async function returnFirstServiceOn(serviceKey1, serviceKey2){
    return await redis.get(serviceKey1) ?? await redis.get(serviceKey2)
}

module.exports = {checkServices, getActiveUrl, returnFirstServiceOn}