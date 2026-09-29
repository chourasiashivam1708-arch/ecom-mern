const mongoose = require('mongoose');
const Product = require('../models/Product');
const Reservation = require('../models/Reservation');

// NEW: Reservations last ten minutes. After that, cleanup restores their stock.
const RESERVATION_DURATION_MS = 10 * 60 * 1000;

// NEW: Creates an Error that controllers can return to the frontend with the correct HTTP status.
const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// NEW: Atomically reserve every item and create one active reservation document.
// This function is called before Razorpay is opened, not when an item is merely added to the cart.
const reserveInventory = async ({ userId, items, address }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, 'No order items');
  }

  const session = await mongoose.startSession();

  try {
    let reservation;

    // A transaction means all stock updates and the reservation succeed together or roll back together.
    await session.withTransaction(async () => {
      const reservedItems = [];
      let totalAmount = 0;

      for (const item of items) {
        if (!mongoose.isValidObjectId(item.productId) || !Number.isInteger(item.qty) || item.qty < 1) {
          throw createHttpError(400, 'Each cart item needs a valid product and quantity');
        }

        // This single atomic update checks stock and decreases it, preventing last-item overselling.
        const product = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.qty } },
          { $inc: { stock: -item.qty } },
          { new: true, session }
        );

        if (!product) {
          throw createHttpError(400, 'One or more products are out of stock');
        }

        // Use the database price rather than a price supplied by the browser.
        reservedItems.push({
          productId: product._id,
          qty: item.qty,
          price: product.price
        });
        totalAmount += product.price * item.qty;
      }

      // This document records who owns the temporary stock hold and when it ends.
      reservation = new Reservation({
        userId,
        items: reservedItems,
        totalAmount,
        address,
        expiresAt: new Date(Date.now() + RESERVATION_DURATION_MS)
      });

      await reservation.save({ session });
    });

    return reservation;
  } finally {
    // Always close the database session after the transaction finishes or fails.
    await session.endSession();
  }
};

// NEW: Restores stock only once by changing an active reservation to released inside a transaction.
const releaseReservationById = async (reservationId, userId) => {
  if (!mongoose.isValidObjectId(reservationId)) {
    throw createHttpError(400, 'Invalid reservation ID');
  }

  const session = await mongoose.startSession();

  try {
    let releasedReservation = null;

    await session.withTransaction(async () => {
      const query = { _id: reservationId, status: 'active' };

      // When userId is supplied, customers can release only their own reservation.
      if (userId) query.userId = userId;

      // Claim the active reservation first, so another release request cannot restore stock twice.
      releasedReservation = await Reservation.findOneAndUpdate(
        query,
        { $set: { status: 'released', releasedAt: new Date() } },
        { new: true, session }
      );

      if (!releasedReservation) return;

      // Add every reserved quantity back to its Product document.
      for (const item of releasedReservation.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.qty } },
          { session }
        );
      }
    });

    return releasedReservation;
  } finally {
    await session.endSession();
  }
};

// NEW: HTTP endpoint called when Razorpay payment fails or the customer cancels checkout.
const releaseReservation = async (req, res) => {
  try {
    const reservation = await releaseReservationById(req.params.id, req.user._id);

    if (!reservation) {
      return res.status(404).json({ message: 'Active reservation not found' });
    }

    res.json({ message: 'Reservation released and stock restored' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// NEW: Releases abandoned reservations after their ten-minute checkout window has expired.
const releaseExpiredReservations = async () => {
  const expiredReservations = await Reservation.find({
    status: 'active',
    expiresAt: { $lte: new Date() }
  }).select('_id');

  for (const reservation of expiredReservations) {
    await releaseReservationById(reservation._id);
  }

  return expiredReservations.length;
};

module.exports = {
  reserveInventory,
  releaseReservation,
  releaseReservationById,
  releaseExpiredReservations,
  createHttpError
};
