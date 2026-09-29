import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { clearCart } from '../../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // const handlePayment = async () => {
  //   try {
  //     const orderRes = await fetch('/api/payment/order', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ amount: totalPrice })
  //     });
  //     const orderData = await orderRes.json();

  //     if (!orderRes.ok) {
  //       // Razorpay unconfigured exception handler
  //       const fallback = window.confirm("Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?");
  //       if (fallback) {
  //         return bypassPayment();
  //       } else {
  //         return alert("Payment failed to initialize");
  //       }
  //     }

  //     const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-cta').trim() || '#0071E3';

  //     const options = {
  //       key: 'rzp_test_dummykey123', // Student dummy fallback
  //       amount: orderData.amount,
  //       currency: orderData.currency,
  //       name: 'ShopNest',
  //       description: 'Test Transaction',
  //       order_id: orderData.id,
  //       handler: async function (response) {
  //         const verifyRes = await fetch('/api/payment/verify', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(response)
  //         });
  //         if (verifyRes.ok) {
  //           const saveOrderRes = await fetch('/api/orders', {
  //             method: 'POST',
  //             headers: { 
  //               'Content-Type': 'application/json',
  //               Authorization: `Bearer ${user.token}`
  //             },
  //             body: JSON.stringify({
  //               items: cartItems,
  //               totalAmount: totalPrice,
  //               address,
  //               paymentId: response.razorpay_payment_id
  //             })
  //           });

  //           if (saveOrderRes.ok) {
  //             dispatch(clearCart());
  //             navigate('/ordersuccess');
  //           } else {
  //             alert('Order saving failed');
  //           }
  //         } else {
  //           alert('Payment verification failed');
  //         }
  //       },
  //       prefill: {
  //         name: address.fullName,
  //         email: user?.email,
  //         contact: '9999999999'
  //       },
  //       theme: {
  //         color: themeColor
  //       }
  //     };
      
  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

const handlePayment = async () => {
  try {
    // Step 1: Ask backend to create a Razorpay payment order.
    const orderRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // NEW: The backend needs the JWT to create a reservation for this customer only.
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        // NEW: The backend validates product IDs, calculates prices, and reserves these items.
        items: cartItems,
        address
      })
    });

    const orderData = await orderRes.json();

    // If stock is unavailable, the backend returns 400 before the payment popup opens.
    if (!orderRes.ok) {
      // NEW: The development-only bypass is offered only when Razorpay itself is unavailable.
      if (orderRes.status >= 500) {
        const fallback = window.confirm(
          'Razorpay could not start. Use Student Bypass Mode to place a local test order?'
        );

        if (fallback) {
          return bypassPayment();
        }
      }

      alert(orderData.message || 'Unable to start checkout.');
      if (orderRes.status === 400) navigate('/cart');
      return;
    }

    const themeColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-cta')
        .trim() || '#0071E3';

    // Step 2: Configure Razorpay checkout popup.
    const options = {
      // NEW: The real public Razorpay key comes from the backend response.
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'BestShop',
      description: 'Order Payment',
      order_id: orderData.id,

      // Step 3: This runs only after Razorpay reports payment success.
      handler: async function (response) {
        try {
          // Step 4: Send Razorpay response to backend.
          // Backend verifies the payment signature securely.
          const verifyRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            ...response,
            // NEW: Links this verified payment to the stock reservation created before payment.
            reservationId: orderData.reservationId
          })
          });

          const verifyData = await verifyRes.json();

          // Stop if payment signature verification fails.
          if (!verifyRes.ok) {
            // NEW: A failed verification must release the temporary stock hold immediately.
            await releaseReservation(orderData.reservationId);
            alert(
              verifyData.message ||
              'Payment verification failed. Please try again.'
            );
            return;
          }

          // Step 5: verifyPayment now creates the final Order from the active reservation.
          dispatch(clearCart());
          navigate('/ordersuccess');

        } catch (error) {
          console.error('Checkout processing error:', error);
          alert(
            'Something went wrong while processing your order. Please try again.'
          );
        }
      },

      prefill: {
        name: address.fullName,
        email: user?.email,
        contact: '9999999999'
      },

      theme: {
        color: themeColor
      }
    };

    // Step 7: Open Razorpay payment popup.
    const rzp1 = new window.Razorpay(options);

    // NEW: Razorpay emits this event on a failed payment, so stock can be restored immediately.
    rzp1.on('payment.failed', () => releaseReservation(orderData.reservationId));
    rzp1.open();

  } catch (error) {
    console.error('Payment initialization error:', error);
    alert('Unable to start payment. Please try again.');
  }
};

  // const bypassPayment = async () => {
  //   const saveOrderRes = await fetch('/api/orders', {
  //     method: 'POST',
  //     headers: { 
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${user.token}`
  //     },
  //     body: JSON.stringify({
  //       items: cartItems,
  //       totalAmount: totalPrice,
  //       address,
  //       paymentId: 'bypass_txn_' + Date.now()
  //     })
  //   });
  //   if (saveOrderRes.ok) {
  //     dispatch(clearCart());
  //     navigate('/ordersuccess');
  //   }
  // };

  const bypassPayment = async () => {
  try {
    // NEW: This development-only endpoint follows the same reservation-to-order flow without Razorpay.
    const saveOrderRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/bypass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        address
      })
    });

    const saveOrderData = await saveOrderRes.json();

    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    } else {
      alert(
        saveOrderData.message ||
        'Product is out of stock. Please update your cart.'
      );

      navigate('/cart');
    }
  } catch (error) {
    console.error('Bypass order error:', error);
    alert('Unable to place the order. Please try again.');
  }
};

  // NEW: Tells the backend to restore stock if a Razorpay modal is dismissed before payment completes.
  const releaseReservation = async (reservationId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/payment/reservation/${reservationId}/release`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
    } catch (error) {
      // Expiry cleanup on the backend is the fallback if this browser request cannot be sent.
      console.error('Could not release reservation:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
