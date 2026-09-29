import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: 'var(--color-surface)',
    borderRadius: '16px',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-strong)',
    textAlign: 'center',
  };

  const socialBtnStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '10px 20px',
    background: 'var(--color-surface-muted)',
    color: 'var(--color-text)',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid var(--color-border)',
  };

  return (
    <div style={containerStyle}>
      <img
        src="/dp.jpg"
        alt="@shivamchourasia_01"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid var(--color-primary)',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-cta)',
        }}
      />

      <h2
        style={{
          fontSize: '2.5rem',
          marginBottom: '10px',
          color: 'var(--color-text)',
        }}
      >
        About Me
      </h2>

      <h3
        style={{
          fontSize: '1.5rem',
          color: 'var(--color-primary)',
          marginBottom: '15px',
        }}
      >
        SHIVAM CHOURASIA
      </h3>

      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '1.2rem',
          lineHeight: '1.8',
          maxWidth: '600px',
          margin: '0 auto 30px auto',
        }}
      >
       <strong>BestShop</strong> was created by Shivam Chourasia, a software developer passionate about building modern web applications and creating digital experiences that solve real-world problems.
 
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <a
          href="https://www.instagram.com/shivam_chourasia_01/"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
           Instagram
        </a>

        <a
          href="https://www.linkedin.com/in/shivam-chourasia1708/"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
           LinkedIn
        </a>

        
      </div>
    </div>
  );
};

export default About;