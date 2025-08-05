const { Router } = require('express');
const paymentController = require('./controllers/paymentsController');
const router = Router();

router.post("/payments",paymentController.postPayment);
router.get('/payments-summary', paymentController.getPayments);
router.get('/info/list',paymentController.getLengthList);
module.exports = router;
