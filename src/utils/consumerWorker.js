const redis = require('./redisConfig');
const {returnFirstServiceOn} = require('./healthCheck');
const {dispatchPayment } = require('./processPayment');
async function consumeQueue() {
  console.log('🔄 Aguardando tarefas...');

  while (true) {
    const servicoOnline = await returnFirstServiceOn("service:A:url", "service:B:url");

    if (!servicoOnline) {
      console.log("[SERVICO OFFLINE]: aguardando...");
      await new Promise(res => setTimeout(res, 1000)); // espera 1s e tenta de novo
      continue; // volta para o início do loop sem consumir nada
    }

    const result = await redis.brPop('fila_pagamentos', 0);
    const task = JSON.parse(result.element);

    console.log('[PROCESSANDO]:', task);
    console.log("[SERVICO STATUS]: ", servicoOnline);

    dispatchPayment(task, servicoOnline);
  }
}

consumeQueue();