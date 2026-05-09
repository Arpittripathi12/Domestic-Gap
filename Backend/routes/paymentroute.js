const express = require("express");
const router = express.Router();

const { makepayment } = require("../payment/razorpay");

router.post("/create-order", makepayment);

module.exports = router;