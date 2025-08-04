const axios = require('axios');

 async function dispatchPayment(payload, serviceOn){
  try {

    const serviceA = await axios.post(`${serviceOn}/payments`, payload);

    if(serviceA.status === 200){
        console.log("[ORDEM DE PAGAMENTO ENVIADA COM SUCESSO]: ",payload.correlationId);
        console.log(serviceA.data);
    }

  } catch (error) {
    console.log(error);
  }
};

module.exports = { dispatchPayment };
