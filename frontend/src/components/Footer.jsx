import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: '40px 20px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>
            BestShop
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Best E-Commerce Platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/about" style={footerLinkStyle}>About Us</Link>
          <Link to="/return" style={footerLinkStyle}>Return Policy</Link>
          <Link to="/disclaimer" style={footerLinkStyle}>Disclaimer</Link>
        </div>

        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} BestShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle = {
  color: 'var(--color-text-muted)',
  fontSize: '0.9rem',
  textDecoration: 'none',
};

export default Footer;
