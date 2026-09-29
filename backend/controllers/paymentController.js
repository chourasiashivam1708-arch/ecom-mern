const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const sendEmail = require('../utils/sendEmail');
const {
  reserveInventory,
  releaseReservationById,
  createHttpError
} = require('./reservationController');

// NEW: Converts one active reservation into the final Order after payment is trusted.
const completeReservation = async ({ reservationId, userId, paymentId, razorpayOrderId }) => {
  if (!mongoose.isValidObjectId(reservationId)) {
    throw createHttpError(400, 'Invalid reservation ID');
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      // Only the owner can complete an active, unexpired reservation.
      const reservation = await Reservation.findOneAndUpdate(
        {
          _id: reservationId,
          userId,
          status: 'active',
          expiresAt: { $gt: new Date() }
        },
        {
          $set: {
            status: 'completed',
            paymentId,
            razorpayOrderId
          }
        },
        { new: true, session }
      );

      if (!reservation) {
        throw createHttpError(400, 'Reservation expired, was released, or has already been completed');
      }

      // Stock was reduced at reservation time, so this only creates the final order document.
      createdOrder = new Order({
        userId: reservation.userId,
        items: reservation.items,
        totalAmount: reservation.totalAmount,
        address: reservation.address,
        paymentId
      });

      await createdOrder.save({ session });
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
};

const createOrder = async (req, res) => {
  let reservation;

  try {
    // NEW: Reserve inventory and calculate the real total from MongoDB before payment begins.
    reservation = await reserveInventory({
      userId: req.user._id,
      items: req.body.items,
      address: req.body.address
    });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    // Razorpay accepts amount in paise
    const options = {
      // NEW: Use the server-calculated reservation total, never the browser amount.
      amount: Math.round(reservation.totalAmount * 100),
      currency: "INR",
    };
    
    const order = await instance.orders.create(options);
    if (!order) throw new Error('Unable to create Razorpay order');

    // Save Razorpay's order ID so payment confirmation can be linked to this reservation.
    reservation.razorpayOrderId = order.id;
    await reservation.save();

    res.json({
      ...order,
      reservationId: reservation._id,
      expiresAt: reservation.expiresAt,
      totalAmount: reservation.totalAmount,
      // Razorpay key ID is public and must be sent to the browser to open checkout.
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    // If payment initialization fails, release the just-created reservation whenever possible.
    if (reservation) {
      await releaseReservationById(reservation._id);
    }
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      reservationId
    } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // NEW: Create the final Order only after the payment signature has been verified.
      const createdOrder = await completeReservation({
        reservationId,
        userId: req.user._id,
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      });

      // Send the confirmation after the transaction commits, so email is sent only for a saved order.
      await sendEmail({
        email: req.user.email,
        subject: 'BestShop - Order Confirmation',
        message: `<h2>Order Confirmation</h2><p>Hello ${req.user.name},</p><p>Your order ID is <strong>${createdOrder._id}</strong>.</p>`
      });

      return res.status(201).json({
        message: 'Payment verified and order created successfully',
        order: createdOrder
      });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// NEW: Development-only flow that lets the project be tested without Razorpay credentials.
const createBypassOrder = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ message: 'Not found' });
    }

    const reservation = await reserveInventory({
      userId: req.user._id,
      items: req.body.items,
      address: req.body.address
    });

    // This immediately completes the reservation with a clearly marked local test payment ID.
    const createdOrder = await completeReservation({
      reservationId: reservation._id,
      userId: req.user._id,
      paymentId: `bypass_txn_${Date.now()}`,
      razorpayOrderId: 'bypass_order'
    });

    res.status(201).json({ order: createdOrder });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment, createBypassOrder };
