const express = require('express');
const router = express.Router();
const {registerUser, loginUser, verifyOtp, getUsers} = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');


router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/verify-otp",verifyOtp);
router.get("/users",protect,admin,getUsers);

// protect : it is a middleware
// Middleware is a function that runs between receiving a request and reaching the final controller.

module.exports = router; 
