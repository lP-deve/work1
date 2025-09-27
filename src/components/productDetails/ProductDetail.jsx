// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StoreHeader from '../header/StoreHeader';
import Cart from '../cartItems/Cart';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.redseam.redberryinternship.ge/api/products/${id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('პროდუქტის ჩატვირთვა ვერ მოხერხდა');

        const data = await res.json();
        setProduct(data);

        setSelectedColorIndex(0);
        setSelectedSize(data.available_sizes?.[0] || null);
        setMainImage(data.images?.[0] || data.cover_image || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!product || selectedColorIndex === null || !selectedSize) return;

    try {
     
      const cartRes = await fetch(`https://api.redseam.redberryinternship.ge/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cartRes.ok) throw new Error("კალათის ჩატვირთვა ვერ მოხერხდა");

      const cartData = await cartRes.json();

   
      const existingItem = cartData.products.find(
        (item) =>
          item.product.id === product.id &&
          item.color === product.available_colors[selectedColorIndex] &&
          item.size === selectedSize
      );

      let payload;
      let url;
      let method;

      if (existingItem) {
    
        payload = {
          quantity: existingItem.quantity + quantity,
          color: existingItem.color,
          size: existingItem.size,
        };
        url = `https://api.redseam.redberryinternship.ge/api/cart/products/${product.id}`;
        method = "PUT"; 
      } else {
        
        payload = {
          quantity,
          color: product.available_colors[selectedColorIndex],
          size: selectedSize,
        };
        url = `https://api.redseam.redberryinternship.ge/api/cart/products/${product.id}`;
        method = "POST";
      }

   
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "კალათაში დამატება ვერ მოხერხდა");
      }

      setSuccessMessage("✅ პროდუქტი დაემატა კალათაში!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>იტვირთება...</p>;
  if (error) return <p style={{ color: 'red' }}>შეცდომა: {error}</p>;
  if (!product) return <p>პროდუქტი ვერ მოიძებნა.</p>;

  return (
    <>
      <StoreHeader />

    
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1100,
          padding: '10px 15px',
          background: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
         კალათა
      </button>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="product-detail" style={{ display: 'flex', padding: '20px' }}>
      
        <div className="product-images" style={{ flex: 1 }}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="main-image"
              style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }}
            />
          ) : (
            <p>სურათი არ არის</p>
          )}

          {product.images?.length > 1 && (
            <div className="thumbnails" style={{ marginTop: '10px', display: 'flex' }}>
              {product.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setMainImage(imgUrl)}
                  style={{
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                    marginRight: '10px',
                    border: mainImage === imgUrl ? '2px solid black' : '1px solid gray',
                    objectFit: 'cover',
                  }}
                />
              ))}
            </div>
          )}
        </div>

      
        <div className="product-info" style={{ flex: 1, marginLeft: '40px', maxWidth: '500px' }}>
          <h2>{product.name}</h2>
          <p><strong>ფასი:</strong> {product.price} ₾</p>
          <p><strong>წელი:</strong> {product.release_year}</p>
          <p><strong>აღწერა:</strong> {product.description}</p>

          {product.brand && (
            <div className="brand-info" style={{ marginTop: '20px' }}>
              <h3>ბრენდი: {product.brand.name}</h3>
              {product.brand.image && (
                <img
                  src={product.brand.image}
                  alt={product.brand.name}
                  style={{ width: '100px', marginTop: '10px', objectFit: 'contain' }}
                />
              )}
            </div>
          )}

        
          {product.available_colors?.length > 0 && (
            <div className="colors" style={{ marginTop: '20px' }}>
              <p><strong>ფერები:</strong></p>
              {product.available_colors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColorIndex(index);
                    setMainImage(product.images?.[index] || product.cover_image);
                  }}
                  title={color}
                  style={{
                    backgroundColor: color.toLowerCase(),
                    border: selectedColorIndex === index ? '2px solid black' : '1px solid #ccc',
                    width: '30px',
                    height: '30px',
                    marginRight: '10px',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          )}

         
          {product.available_sizes?.length > 0 && (
            <div className="sizes" style={{ marginTop: '20px' }}>
              <p><strong>ზომა:</strong></p>
              {product.available_sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    marginRight: '10px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    border: selectedSize === size ? '2px solid black' : '1px solid #ccc',
                    backgroundColor: selectedSize === size ? '#eee' : 'white',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

       
          <div style={{ marginTop: '20px' }}>
            <p><strong>რაოდენობა:</strong></p>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{ marginRight: '10px', padding: '5px 10px' }}
            >-</button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >+</button>
          </div>

       
          <button
            onClick={handleAddToCart}
            style={{
              marginTop: '30px',
              padding: '10px 20px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '4px',
            }}
          >
            კალათაში დამატება
          </button>

          {successMessage && (
            <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
