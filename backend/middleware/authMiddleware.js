const jwt = require('jsonwebtoken'); // JWT token verify karne ke liye

const User = require('../models/User'); // Database se user details nikalne ke liye

// Authentication Middleware
const protect = async (req, res, next) => {

    // Token store karne ke liye variable
    let token;

    // Check karo ki Authorization header exist karta hai
    // Aur uska format "Bearer <token>" hai
    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {

        try {

            // "Bearer xyz123" me se actual token nikalo
            token = req.headers.authorization.split(' ')[1];

            // Token verify karo using JWT secret
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Decoded token me stored user id se user fetch karo
            // Password field hata di gayi hai security ke liye
            req.user = await User.findById(decoded.id).select('-password');

            // Token valid hai
            // Request ko next middleware/controller tak bhej do
            next();

        } catch (error) {

            // Token invalid ya expired hai
            res.status(401).json({
                message: 'Not authorized, token failed'
            });

        }
    }

    // Agar token hi nahi bheja gaya
    if (!token) {

        res.status(401).json({
            message: 'Not authorized, no token'
        });

    }
};

module.exports = { protect };