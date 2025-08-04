const redis = require("../utils/redisConfig");
const { getNextWorker } = require("../utils/worker");

module.exports = {
  async postPayment(req, res) {
    try {
      if (typeof req.body.correlationId !== "string" || !req.body.correlationId)
        throw new Error("correlationId is required");
      if (typeof req.body.amount !== "number" || !req.body.amount)
        throw new Error("[amount] is required");

      const { correlationId, amount } = req.body;

      const worker = getNextWorker(); // pega o próximo worker do pool
      worker.postMessage({ correlationId, amount });

      res.status(200).json({
        message: "Transação atribuída ao worker e enfileirada",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message ?? "Erro de processamento",
      });
    }
  },

  async getPayments(req, res) {
    try {
      // lógica futura para listar
    } catch (error) {
      res.status(400).json({
        status: error.message,
      });
    }
  },
};
