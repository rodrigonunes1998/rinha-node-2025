const path = require('path');
const { Worker } = require('worker_threads');

function startQueueWorker(id) {
  const workerPath = path.resolve(__dirname, 'consumerWorker.js');
  const worker = new Worker(workerPath, {
    workerData: { workerId: id }, // Passando o ID para o worker
  });

  worker.on('online', () => {
    console.log(`[MAIN] Worker ${id} iniciado`);
  });

  worker.on('exit', code => {
    if (code !== 0) {
      console.error(`[MAIN] Worker ${id} finalizou com código ${code}`);
    } else {
      console.log(`[MAIN] Worker ${id} encerrado normalmente`);
    }
  });

  worker.on('error', err => {
    console.error(`[MAIN] Erro no Worker ${id}:`, err);
  });
}

const concurrency = Number(process.env.WORKER_CONCURRENCY || 1);
for (let i = 0; i < concurrency; i++) {
  startQueueWorker(i);
}