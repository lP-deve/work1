
import React, { useEffect, useState } from 'react';
import './Cart.css'; 

const Cart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fallbackImage = 'https://via.placeholder.com/80';
  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.redseam.redberryinternship.ge/api/cart', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('კალათის ჩატვირთვა ვერ მოხერხდა');
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const handleIncrease = async (item) => {
    try {
      await fetch(
        `https://api.redseam.redberryinternship.ge/api/cart/products/${item.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: item.quantity + 1 }),
        }
      );
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await fetch(
        `https://api.redseam.redberryinternship.ge/api/cart/products/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>🛒 თქვენი კალათა</h2>
        <button onClick={onClose} className="close-btn">✖</button>
      </div>

      {loading ? (
        <p>იტვირთება...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>შეცდომა: {error}</p>
      ) : cartItems.length === 0 ? (
        <p>კალათა ცარიელია</p>
      ) : (
        <>
          <p>პროდუქტების რაოდენობა: {totalQuantity}</p>
          <p>ჯამური ფასი: {totalPrice} ₾</p>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.cover_image || item.images?.[0] || fallbackImage}
                alt={item.name}
              />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>ფასი: {item.price} ₾</p>
                <p>რაოდ: {item.quantity}</p>
                <p>ჯამი: {item.total_price} ₾</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleIncrease(item)}>+</button>
                <button onClick={() => handleRemove(item.id)} className="remove-btn">🗑</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Cart;
