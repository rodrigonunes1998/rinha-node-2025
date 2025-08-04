const { parentPort } = require('worker_threads');
const redis = require('./redisConfig');

parentPort.on('message', async (payload) => {
  try {
    await redis.rPush('fila_pagamentos', JSON.stringify(payload));
    parentPort.postMessage({ status: 'ok' });
  } catch (err) {
    console.log(err);
    parentPort.postMessage({ status: 'error', error: err.message });
  }
});
