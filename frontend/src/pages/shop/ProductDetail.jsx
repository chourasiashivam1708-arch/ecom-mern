import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import '../../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // const handleAddToCart = () => {
  //   if (product) {
  //     dispatch(addToCart({
  //       productId: product._id,
  //       name: product.name,
  //       price: product.price,
  //       imageUrl: product.imageUrl,
  //       qty: 1
  //     }));
  //     alert('Successfully added to your cart!');
  //   }
  // };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      qty: 1
    }));

    alert('Successfully added to your cart!');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '100px', color: 'var(--color-primary)' }}>Loading Product...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', margin: '100px', color: 'var(--color-danger)' }}>Product Not Found</div>;
  }

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: 'var(--color-primary)' }}>Home</Link> /{' '}
        <Link to="/shop" style={{ color: 'var(--color-primary)' }}>Shop</Link> /{' '}
        {product.category} / <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        <div className="detail-info">
          <h2 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>{product.name}</h2>

          <p className="detail-price" style={{ fontSize: '2.5rem', margin: '15px 0' }}>
            Rs. {product.price.toFixed(2)}
          </p>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: 'var(--color-text)', marginBottom: '10px' }}>Product Description</h4>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn"
              style={{
                flexGrow: '1',
                padding: '18px',
                fontSize: '1.2rem',
                opacity: product.stock <= 0 ? 0.6 : 1,
                cursor: product.stock <= 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {product.stock > 0 ? 'Add to Shopping Cart' : 'Out of Stock'}
            </button>
          </div>

          <p style={{ marginTop: '20px', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: '600' }}>
            {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Temporarily Out of Stock'}
          </p>
        </div>

      </div>

    </div>
  );
};

export default ProductDetail;
