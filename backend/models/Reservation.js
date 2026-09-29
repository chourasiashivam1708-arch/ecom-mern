const mongoose = require('mongoose');

// NEW: A reservation temporarily holds stock while a customer is completing payment.
const reservationSchema = new mongoose.Schema({
  // The authenticated customer who owns this temporary stock hold.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // The server-calculated items, quantities, and purchase-time prices being held.
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 }
    }
  ],

  // The backend calculates this total from Product documents; the client total is not trusted.
  totalAmount: { type: Number, required: true, min: 0 },

  // The delivery address is kept until payment turns this reservation into an Order.
  address: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },

  // active = stock is held; completed = an order was created; released = stock was restored.
  status: {
    type: String,
    enum: ['active', 'completed', 'released'],
    default: 'active'
  },

  // The hold expires after a short checkout window so abandoned carts do not block stock forever.
  expiresAt: { type: Date, required: true },
  releasedAt: { type: Date },
  razorpayOrderId: { type: String },
  paymentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
