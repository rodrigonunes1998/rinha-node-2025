const { Worker } = require('worker_threads');
const path = require('path');

const workerPath = path.resolve(__dirname, './enqueueWorker.js');

const WORKER_COUNT = 2; // Número de workers paralelos
const workers = [];

// Round-robin control
let currentWorker = 0;

for (let i = 0; i < WORKER_COUNT; i++) {
  workers.push(new Worker(workerPath));
}

function getNextWorker() {
  const worker = workers[currentWorker];
  currentWorker = (currentWorker + 1) % WORKER_COUNT;
  return worker;
}

module.exports = { getNextWorker, workers };