const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_test_RIzKRmudRwp3Ru',
  key_secret: 'k50GwVtqGfh6lX5IU0u7jL5H'
});

router.post('/api/create-razorpay-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "order_rcptid_" + Math.random().toString(36).slice(2)
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Razorpay order creation failed" });
  }
});

module.exports = router;
