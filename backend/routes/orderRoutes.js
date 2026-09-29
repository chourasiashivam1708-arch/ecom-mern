// user -> order something , see all his orders ( what all things he has ordered .) 
// admin -> see what all orders he has recieved , update order status . 
// so for these functionalities we have to create controller .
// but in order to reach that controller , routes are required which we will be creating over here .



const express = require('express');
const router = express.Router(); 
const {admin} = require('../middleware/adminMiddleware');
const {protect} = require('../middleware/authMiddleware');

const {getOrders, getMyOrders, updateOrderStatus} = require('../controllers/orderController');

// NEW: Orders are now created only by verified payment/reservation code in paymentController.
router.route('/').get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect,admin,updateOrderStatus);

module.exports = router;
