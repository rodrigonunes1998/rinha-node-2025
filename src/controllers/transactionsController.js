const db = require('../db');
const job = require('../utils/healthCheck');
module.exports = {
  async criar(req, res) {
    try {
      const { id, valor } = req.body;
      await db.query('INSERT INTO transacoes (id, valor) VALUES ($1, $2)', [id, valor]);
      res.status(201).json({ message: 'Transação criada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar transação' });
    }
  },

  async extrato(req, res) {
    try {
      const { id } = req.params;
      const result = await db.query('SELECT * FROM transacoes WHERE id = $1', [id]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar extrato' });
    }
},
async teste(req,res){
    const servicesA = await job.getActiveUrl('service:A:url');
    const servicesB = await job.getActiveUrl('service:B:url');
    console.log("Service A: ",servicesA);
    console.log("Service B: ",servicesB);
    res.json({message: "ok",
        serviceA: servicesA,
        serviceB: servicesB
    })
}
};
