const express = require('express');
const routes = require('./routes');
const jobs = require('../src/utils/healthCheck');
const app = express();
const redis = require('./utils/redisConfig.js');
require('./utils/consumerWorker.js');

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
    console.log("Iniciando servico de health-check");
    console.log("Limpando redis...");
    redis.flushAll();
    setInterval(()=>{
        
        jobs.checkServices();
        console.log("Executando Intervalo")
    },10000);


});





