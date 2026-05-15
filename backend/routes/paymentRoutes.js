const router = require("express").Router();
const c = require("../controllers/paymentController");

router.post("/payments/create-order", c.createOrder);
router.post("/payments/verify", c.verifyPayment);

router.get("/payments/wallet/:user_id", c.getWalletBalance);
router.get("/payments/transactions/:user_id", c.getWalletTransactions);
router.post("/payments/withdraw", c.requestWithdrawal);

// WhatsApp Subscription Routes
router.post("/payments/whatsapp/create-order", c.createWhatsAppOrder);
router.post("/payments/whatsapp/verify", c.verifyWhatsAppPayment);

module.exports = router;
