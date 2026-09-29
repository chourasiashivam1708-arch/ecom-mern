import React from 'react';

const textualStyle = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '40px',
  background: 'var(--color-surface)',
  borderRadius: '16px',
  border: '1px solid var(--color-border)',
  lineHeight: '1.8',
  color: 'var(--color-text-muted)',
  boxShadow: 'var(--shadow-soft)',
};

const headingStyle = {
  color: 'var(--color-text)',
  marginBottom: '20px',
  borderBottom: '1px solid var(--color-border)',
  paddingBottom: '15px',
};

const sectionHeadingStyle = {
  color: 'var(--color-primary)',
  marginTop: '25px',
  marginBottom: '10px',
};

const Disclaimer = () => {
  return (
    <div style={textualStyle}>
      <h2 style={headingStyle}>Disclaimer</h2>

      <p style={{ marginBottom: '20px' }}>
        Welcome to BestShop. By accessing and using this website, you agree to
        the terms outlined in this disclaimer. The information provided on this
        website is for general informational and shopping purposes only.
      </p>

      <h4 style={sectionHeadingStyle}>1. Product Information</h4>
      <p style={{ marginBottom: '15px' }}>
        BestShop strives to ensure that all product descriptions, images,
        pricing, and specifications displayed on the website are accurate and
        up to date. However, we do not guarantee that all information is
        completely error-free, current, or exhaustive at all times.
      </p>

      <h4 style={sectionHeadingStyle}>2. Product Images</h4>
      <p style={{ marginBottom: '15px' }}>
        Product images are provided for illustration purposes. Actual product
        appearance, packaging, colors, or specifications may vary slightly from
        the images displayed on the website depending on manufacturers,
        suppliers, and device screen settings.
      </p>

      <h4 style={sectionHeadingStyle}>3. Pricing & Availability</h4>
      <p style={{ marginBottom: '15px' }}>
        Prices, promotions, discounts, and product availability are subject to
        change without prior notice. BestShop reserves the right to correct any
        pricing errors, inaccuracies, or omissions at any time.
      </p>

      <h4 style={sectionHeadingStyle}>4. Third-Party Links</h4>
      <p style={{ marginBottom: '15px' }}>
        Our website may contain links to third-party websites or services for
        your convenience. BestShop does not control and is not responsible for
        the content, policies, or practices of any third-party websites.
      </p>

      <h4 style={sectionHeadingStyle}>5. Limitation of Liability</h4>
      <p style={{ marginBottom: '15px' }}>
        BestShop shall not be held liable for any direct, indirect, incidental,
        or consequential damages arising from the use of, or inability to use,
        this website, products purchased through the platform, or reliance on
        any information provided on the website.
      </p>

      <h4 style={sectionHeadingStyle}>6. Policy Updates</h4>
      <p style={{ marginBottom: '15px' }}>
        BestShop reserves the right to update, modify, or replace this
        disclaimer at any time without prior notice. Continued use of the
        website following any changes constitutes acceptance of those changes.
      </p>

      <p
        style={{
          marginTop: '30px',
          padding: '16px',
          background: 'var(--color-surface-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          color: 'var(--color-text)',
        }}
      >
        By using BestShop, you acknowledge that you have read, understood, and
        agreed to this disclaimer and all applicable website policies.
      </p>
    </div>
  );
};

export default Disclaimer;