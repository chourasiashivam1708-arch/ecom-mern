const express = require('express');
const { createOrder, verifyPayment, createBypassOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { releaseReservation } = require('../controllers/reservationController');

const router = express.Router();

// NEW: All payment and reservation operations require an authenticated customer.
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/reservation/:id/release', protect, releaseReservation);
router.post('/bypass', protect, createBypassOrder);

module.exports = router;
