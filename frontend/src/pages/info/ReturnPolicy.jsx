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

const noticeBoxStyle = {
  padding: '20px',
  background: 'var(--color-surface-muted)',
  border: '1px solid var(--color-border)',
  borderLeft: '4px solid var(--color-primary)',
  borderRadius: '12px',
  marginBottom: '30px',
};

const ReturnPolicy = () => {
  return (
    <div style={textualStyle}>
      <h2 style={headingStyle}>Return & Refund Policy</h2>

      <p style={{ marginBottom: '20px' }}>
        At BestShop, we are committed to providing a reliable shopping
        experience. We are currently developing a dedicated return and refund
        management system to make post-purchase support more convenient for our
        customers.
      </p>

      <div style={noticeBoxStyle}>
        <h4
          style={{
            color: 'var(--color-text)',
            marginBottom: '10px',
          }}
        >
          Important Notice
        </h4>

        <p style={{ margin: 0 }}>
          The online return and refund feature is currently under development
          and will be introduced in a future release. Until then, customers
          cannot initiate returns directly through the BestShop platform.
        </p>
      </div>

      <h4 style={sectionHeadingStyle}>1. Current Return Status</h4>
      <p>
        BestShop does not currently offer self-service returns through the
        website. Return requests and automated refund workflows will become
        available once the feature has been officially launched.
      </p>

      <h4 style={sectionHeadingStyle}>2. Damaged, Defective, or Incorrect Items</h4>
      <p>
        If you receive a product that is damaged, defective, or different from
        the item ordered, please contact our customer support team with your
        order details and supporting photographs. We will review the issue and
        assist you on a case-by-case basis.
      </p>

      <h4 style={sectionHeadingStyle}>3. Upcoming Returns Service</h4>
      <p>
        BestShop is working on a returns experience similar to leading
        e-commerce platforms. Once released, eligible customers will be able to
        submit return requests, monitor return status, and track refund
        progress directly from their account dashboard.
      </p>

      <h4 style={sectionHeadingStyle}>4. Refund Processing</h4>
      <p>
        Detailed refund timelines, eligibility criteria, and return conditions
        will be published when the returns service becomes available.
      </p>

      <h4 style={sectionHeadingStyle}>5. Customer Support</h4>
      <p>
        For any concerns regarding your order, delivery, or product quality,
        please contact BestShop customer support. We will make every reasonable
        effort to resolve your issue promptly.
      </p>

      <h4 style={sectionHeadingStyle}>6. Future Policy Updates</h4>
      <p>
        This policy may be updated from time to time as new services and
        features become available on the BestShop platform. Customers are
        encouraged to review this page periodically for the latest information.
      </p>
    </div>
  );
};

export default ReturnPolicy;