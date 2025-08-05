const express = require('express');
const routes = require('./routes');
const app = express();
require('./utils/worker');


app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
    console.log("Iniciando servico de health-check");
    //console.log("Limpando redis...");
    // redis.flushAll();
});





