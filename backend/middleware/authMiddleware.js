const jwt = require('jsonwebtoken'); // JWT token verify karne ke liye

const User = require('../models/User'); // Database se user details nikalne ke liye

// Authentication Middleware

// 2. How is it checked for protected routes?
// Once you have the wristband (JWT), React saves it in your browser's localStorage. Now, let's say you want to visit a route where login is required—like viewing your "My Orders" page.

// Here is the step-by-step flow of how it is checked:

// React Sends the Token: When React sends the GET /api/orders/myorders request, it attaches your token to the request's header, looking like this: Authorization: Bearer <Your_JWT_String>.

// The Middleware Bouncer (protect): Before the request reaches the controller that fetches your orders, it is stopped by the protect middleware.

// The Signature Check: The middleware takes your token and uses a secret server password (process.env.JWT_SECRET) to verify that the token was actually created by your server and hasn't been tampered with by a hacker.

// Identifying You: Because the backend encoded your User ID inside the token when it was created, the middleware opens the token, reads the ID, and fetches your details from the MongoDB database.

// Passing the Baton (req.user): The middleware attaches your database profile to the request object as req.user.

// Access Granted: The middleware calls next(), which opens the door. The request finally reaches the order controller, which can now safely use req.user._id to fetch only your specific orders.

// If at any point the token is missing, expired, or faked, the protect middleware stops the request immediately and sends a "401 Unauthorized" error back to React.


// protect middleware:
// Reads Authorization.
// Extracts the token after Bearer.
// Verifies it with JWT_SECRET.
// Gets the user ID from the decoded token.
// Fetches the current user from MongoDB, excluding the password.
// Assigns that user to req.user.
// Calls next() so the controller can run.


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