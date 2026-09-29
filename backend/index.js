const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { releaseExpiredReservations } = require('./controllers/reservationController');
dotenv.config();
connectDB();

const app = express(); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/", (req,res) =>{
    res.send("Shivam's Backend is working properly");
})

// server kah raha hai ki yadi koi bhi request api/auth se start ho eg. api/auth/login toh use authRoutes ke paas bhej dena . 
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/products',require('./routes/productRoutes'));
app.use('/api/orders',require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// NEW: Check once per minute for abandoned checkout reservations and restore their stock.
const reservationCleanupTimer = setInterval(async () => {
    try {
        const releasedCount = await releaseExpiredReservations();
        if (releasedCount > 0) {
            console.log(`Released ${releasedCount} expired stock reservation(s)`);
        }
    } catch (error) {
        console.error('Reservation cleanup failed:', error.message);
    }
}, 60 * 1000);

// This timer should not keep the Node process alive by itself during a graceful shutdown.
reservationCleanupTimer.unref();

const PORT = process.env.PORT || 5000 ;
app.listen(PORT,()=>{
    console.log(`Hey Shivam :) Server is running on port  ${PORT}`);
})
