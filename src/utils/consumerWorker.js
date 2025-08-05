const { parentPort, workerData } = require("worker_threads");
const redis = require("./redisConfig");
const { dispatchPayment } = require("./processPayment");
const DEFAULT_URL = process.env.PROCESSOR_DEFAULT_URL;
const FALLBACK_URL = process.env.PROCESSOR_FALLBACK_URL;

const BATCH_SIZE_MAX = 8;
const workerId = workerData.workerId;

(async () => {
  console.log(`🔄 [WORKER-${workerId}] Aguardando tarefas...`);
  while(true){
    const task = await redis.brPop('fila_pagamentos', 0);
    dispatchPayment(JSON.parse(task.element));
  }
})();

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout após ${ms}ms`)), ms);
  });
}
