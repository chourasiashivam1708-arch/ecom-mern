import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
         
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          if (res.status === 401) {
            logout();
            navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-pill status-delivered';

      case 'Shipped':
        return 'status-pill status-shipped';

      default:
        return 'status-pill status-pending';
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div>
          <h1 className="profile-title">My Account</h1>

          <p className="profile-text">
            <strong>Name:</strong> {user.name}
          </p>

          <p className="profile-text">
            <strong>Email:</strong> {user.email}
          </p>

          <span className="profile-badge">
            {user.role.toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      {/* Orders */}
      <h2 className="orders-title">Order History</h2>

      {loading ? (
        <div className="loading-card">
          Fetching your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-card">
          <h3>No Orders Yet</h3>

          <p>
            Looks like you haven't placed any orders yet.
          </p>

          <Link to="/shop" className="btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            
            <div
              key={order._id}
              className="order-card"
            >
              <div>
                <p className="order-label">
                  Order ID
                </p>

                <p className="order-id">
                  {order._id}
                </p>

                <p className="order-date">
                  Placed on{' '}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>

                <p className="order-total">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>

              <span
                className={getStatusClass(
                  order.status
                )}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;