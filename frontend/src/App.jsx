import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// User Pages
import Home from './pages/home/Home';
import Shop from './pages/shop/Shop';
import ProductDetail from './pages/shop/ProductDetail';

import Cart from './pages/cart/Cart';

import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/checkout/OrderSuccess';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';

import Profile from './pages/user/Profile';

// Information Pages
import About from './pages/info/About';
import Disclaimer from './pages/info/Disclaimer';
import ReturnPolicy from './pages/info/ReturnPolicy';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';
import AdminProducts from './admin/AdminProducts';
import EditProduct from './admin/EditProduct';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';

function App() {
  return (
    <Router>
      <Navbar />

      <div className="main-content">
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Shop */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* User */}
          <Route path="/profile" element={<Profile />} />

          {/* Information */}
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/return" element={<ReturnPolicy />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />

        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Shop from './pages/Shop';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import VerifyOtp from './pages/VerifyOtp';
// import Profile from './pages/Profile';
// import OrderSuccess from './pages/OrderSuccess';
// import About from './pages/About';
// import Disclaimer from './pages/Disclaimer';
// import ReturnPolicy from './pages/ReturnPolicy';
// import AdminDashboard from './admin/AdminDashboard';
// import AddProduct from './admin/AddProduct';
// import AdminProducts from './admin/AdminProducts';
// import EditProduct from './admin/EditProduct';
// import AdminOrders from './admin/AdminOrders';
// import AdminUsers from './admin/AdminUsers';

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="main-content">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/shop" element={<Shop />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/ordersuccess" element={<OrderSuccess />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/disclaimer" element={<Disclaimer />} />
//           <Route path="/return" element={<ReturnPolicy />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/admin/add-product" element={<AddProduct />} />
//           <Route path="/admin/products" element={<AdminProducts />} />
//           <Route path="/admin/edit-product/:id" element={<EditProduct />} />
//           <Route path="/admin/orders" element={<AdminOrders />} />
//           <Route path="/admin/users" element={<AdminUsers />} />
//         </Routes>
//       </div>
//       <Footer />
//     </Router>
//   );
// }

// export default App;
