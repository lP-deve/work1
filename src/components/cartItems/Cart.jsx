import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; 

const API_BASE = "https://api.redseam.redberryinternship.ge/api";

const Cart = ({ isOpen, onClose, localCart, setLocalCart, isCheckout, onPay, payButtonClass }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = localCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (!isOpen) return null;

  const handleDelete = async (item) => {
    setLocalCart(prev =>
      prev.filter(i =>
        !(i.product_id === item.product_id && i.color === item.color && i.size === item.size)
      )
    );

    try {
      await fetch(`${API_BASE}/cart/products/${item.product_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 0 }),
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const updatedCart = localCart.map(i => {
      if (i.product_id === item.product_id && i.color === item.color && i.size === item.size) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    });
    setLocalCart(updatedCart);

    const updatedItem = updatedCart.find(i =>
      i.product_id === item.product_id && i.color === item.color && i.size === item.size
    );

    try {
      await fetch(`${API_BASE}/cart/products/${item.product_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: updatedItem.quantity }),
      });
    } catch (err) {
      console.error("Quantity update failed:", err);
    }
  };

  const total = localCart.reduce((sum, i) => sum + i.price * i.quantity, 0) + 5;

  return (
    <div className="cart">
      <div className="infoCart">
        {!isCheckout && (
          <p>Shopping Cart ({totalItems})</p>

        )}

        {!isCheckout && <button className="close-btn" onClick={onClose}><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L16 14.5858L23.2929 7.29289C23.6834 6.90237 24.3166 6.90237 24.7071 7.29289C25.0976 7.68342 25.0976 8.31658 24.7071 8.70711L17.4142 16L24.7071 23.2929C25.0976 23.6834 25.0976 24.3166 24.7071 24.7071C24.3166 25.0976 23.6834 25.0976 23.2929 24.7071L16 17.4142L8.70711 24.7071C8.31658 25.0976 7.68342 25.0976 7.29289 24.7071C6.90237 24.3166 6.90237 23.6834 7.29289 23.2929L14.5858 16L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z" fill="#10151F" />
        </svg>
        </button>}
      </div>

      {localCart.length === 0 ? (
        <div className="empty-cart">
          <img src="/Group.png" alt="cart" />
          <h4>Ooops!</h4>
          <p className="empty-cart-text">You've got nothing in your cart just yet...</p>
          <button onClick={() => navigate("/store")}>Start shopping</button>
        </div>
      ) : (
        <div className="seperate">

          <ul className="cart-list">
            {localCart.map(it => (
              <li key={`${it.product_id}-${it.color}-${it.size}`} className="cart-item">
                <img src={it.image} alt={it.name} className="item-img" />
                <div className="item-info">
                  <div className="groupOne">
                    <p className="itemName">{it.name}</p>
                    <p className="specific"> {it.color}</p>
                    <p className="specific">{it.size}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(it, -1)}>-</button>
                      <span>{it.quantity}</span>
                      <button onClick={() => handleQuantityChange(it, +1)}>+</button>
                    </div></div>
                  <div className="grouptwo">
                    <p>{it.price}$</p>

                    <button className="delete-btn" onClick={() => handleDelete(it)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="div">
            <div className="subtotal"><p>Items subtotal</p> <p>{subtotal}$</p></div>
            <div className="fee"> <p className="cart-delivery">Delivery</p><p>5$</p></div>
            <div className="total"> <p className="cart-total">Total</p> <p>{total}$</p></div>

            {isCheckout ? (
              <button className="pay-btn" onClick={onPay}>Pay</button>
            ) : (
              <button className="checkout-btn" onClick={() => navigate("/checkout")}>Checkout</button>
            )}</div>
        </div>
      )}
    </div>
  );
};

export default Cart;
