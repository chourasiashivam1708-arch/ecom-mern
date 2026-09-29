import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  const cardStyle = {
    padding: '25px',
    background: 'var(--color-surface)',
    border: '1px solid var(--overlay-border-soft)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-soft)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px'
  };

  const numberStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--color-primary)'
  };

  const mutedHeadingStyle = {
    color: 'var(--color-text-muted)',
    fontSize: '1rem'
  };

  const secondaryButtonStyle = {
    background: 'var(--color-surface-muted)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-border)'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
        <img
          src="/BestShopLogo.png"
          alt="Logo"
          style={{ height: '40px', width: '40px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 0 10px var(--overlay-primary-soft))' }}
        />
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>
        Welcome back, <span style={{ color: 'var(--color-text)' }}>{user?.name}</span>
      </p>

      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={cardStyle}>
            <h4 style={mutedHeadingStyle}>Total Orders</h4>
            <div style={numberStyle}>{stats.totalOrders}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={mutedHeadingStyle}>Total Products</h4>
            <div style={numberStyle}>{stats.totalProducts}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={mutedHeadingStyle}>Total Users</h4>
            <div style={numberStyle}>{stats.totalUsers}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={mutedHeadingStyle}>Total Revenue</h4>
            <div style={numberStyle}>Rs. {stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '50px 0', color: 'var(--color-primary)' }}>Loading metrics...</div>
      )}

      <div style={{ marginTop: '40px', padding: '30px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--overlay-border-soft)', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ marginBottom: '25px', color: 'var(--color-primary)' }}>Administrative Controls</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
          <button className="btn" onClick={() => navigate('/admin/products')} style={secondaryButtonStyle}>Manage Products</button>
          <button className="btn" onClick={() => navigate('/admin/orders')} style={secondaryButtonStyle}>Manage Orders</button>
          <button className="btn" onClick={() => navigate('/admin/users')} style={secondaryButtonStyle}>Users Directory</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
