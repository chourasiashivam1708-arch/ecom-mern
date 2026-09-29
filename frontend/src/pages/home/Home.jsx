import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/products`
        );
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1 className="hero-title" aria-label="Welcome to BestShop">
          <span className="hero-title-sizer" aria-hidden="true">
            Where Quality Meets Value
          </span>

          <span className="hero-title-animated">
            Welcome to BestShop
          </span>
        </h1>

        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2>Featured Products</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from 'react';
// import ProductCard from '../../components/ProductCard';

// const heroPhrases = [
//   'Welcome to BestShop',
//   'Where Quality Meets Value',
//   'Shop Smarter Every Day',
// ];

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [phraseIndex, setPhraseIndex] = useState(0);
//   const [typedText, setTypedText] = useState('');
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
//         const data = await res.json();
//         setProducts(data.slice(0, 4)); // Featured products
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // useEffect(() => {
//   //   const currentPhrase = heroPhrases[phraseIndex];
//   //   const isPhraseComplete = !isDeleting && typedText === currentPhrase;
//   //   const isPhraseDeleted = isDeleting && typedText === '';
//   //   const delay = isPhraseComplete ? 1400 : isPhraseDeleted ? 350 : isDeleting ? 42 : 72;

//   //   const timeout = setTimeout(() => {
//   //     if (isPhraseComplete) {
//   //       setIsDeleting(true);
//   //       return;
//   //     }

//   //     if (isPhraseDeleted) {
//   //       setIsDeleting(false);
//   //       setPhraseIndex((currentIndex) => (currentIndex + 1) % heroPhrases.length);
//   //       return;
//   //     }

//   //     setTypedText((currentText) => (
//   //       isDeleting
//   //         ? currentPhrase.slice(0, currentText.length - 1)
//   //         : currentPhrase.slice(0, currentText.length + 1)
//   //     ));
//   //   }, delay);

//   //   return () => clearTimeout(timeout);
//   // }, [phraseIndex, typedText, isDeleting]);

//   return (
//     <div className="home-container">
//       <div className="hero-banner">
//         <h1 className="hero-title" aria-label={heroPhrases[phraseIndex]}>
//           <span className="hero-title-sizer" aria-hidden="true">
//             Where Quality Meets Value
//           </span>
//           <span className="hero-title-animated">
            
//             Welcome to BestShop
//             {/* <span className="typewriter-cursor" aria-hidden="true" /> */}
//           </span>
//         </h1>
//         <p>Discover the best products at unbeatable prices.</p>
//       </div>
//       <h2>Featured Products</h2>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="product-grid">
//           {products.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
