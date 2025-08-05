const redis = require("../utils/redisConfig");
const { getDateKey } = require("../utils/processPayment");


module.exports = {
  async postPayment(req, res) {
    try {
      if (typeof req.body.correlationId !== "string" || !req.body.correlationId)
        throw new Error("correlationId is required");
      if (typeof req.body.amount !== "number" || !req.body.amount)
        throw new Error("[amount] is required");

      //  if (typeof req.body.requestedAt !== "string" || !req.body.requestedAt)
      //   throw new Error("[requestedAt] is required");

      const { correlationId, amount, requestedAt } = req.body;

      const exists = await redis.exists(`correlation:${correlationId}`);
      if (exists) {
        return res
          .status(409)
          .json({ message: "CorrelationId already exists" });
      }
        // Previne race condition: marca como em processamento por 60s
       await redis.set(`correlation:${correlationId}`, "processing", {
        NX: true,
        EX: 60,
      });


      //Enfileirar diretamente com o redis
      await redis.rPush(
        "fila_pagamentos",
        JSON.stringify({ correlationId, amount, requestedAt })
      );
      res.status(202).json({
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
      const { from, to } = req.query;

      const now = new Date();

      const start = from
        ? new Date(from)
        : new Date(now.getTime() - 10 * 60000);
      const end = to ? new Date(to) : now;

      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ error: "Parâmetros 'from' ou 'to' inválidos" });
      }

      const keys = [];
      let current = new Date(start);

      while (current <= end) {
        const keySuffix = getDateKey(current);
        keys.push({
          default: `summary:default:${keySuffix}`,
          fallback: `summary:fallback:${keySuffix}`,
        });
        current.setMinutes(current.getMinutes() + 1);
      }

      let summary = {
        default: { totalRequests: 0, totalAmount: 0 },
        fallback: { totalRequests: 0, totalAmount: 0 },
      };

      for (const pair of keys) {
        for (const service of ["default", "fallback"]) {
          const key = pair[service];
          const data = await redis.hGetAll(key);

          summary[service].totalRequests += parseInt(data.totalRequests || "0");
          summary[service].totalAmount += parseFloat(data.totalAmount || "0");
        }
      }

      // Retorno final com os campos obrigatórios sempre presentes
      res.json({
        default: {
          totalRequests: summary.default.totalRequests,
          totalAmount: Number(summary.default.totalAmount.toFixed(2)), // normaliza float
        },
        fallback: {
          totalRequests: summary.fallback.totalRequests,
          totalAmount: Number(summary.fallback.totalAmount.toFixed(2)),
        },
      });
    } catch (error) {
      res.status(400).json({ status: error.message });
    }
  },

  async clearDatabase(req,res){
    try {
      await redis.flushAll();
      res.status(200);
    } catch (error) {
      res.status(400).json({
        message: error.message
      })
    }
  },

  async getLengthList(req,res){
    try {
      res.status(200).json({
        lList: await redis.lLen("fila_pagamentos")
      })
    } catch (error) {
      res.status(400);
    }
  }
};
