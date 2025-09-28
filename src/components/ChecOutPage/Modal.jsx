import React from "react";
import './Modal.css';
import { useNavigate } from "react-router-dom";

const Modal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000
    }}>
      <div className="modal">

        <div className="removeModal" onClick={onClose} style={{ cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L16 14.5858L23.2929 7.29289C23.6834 6.90237 24.3166 6.90237 24.7071 7.29289C25.0976 7.68342 25.0976 8.31658 24.7071 8.70711L17.4142 16L24.7071 23.2929C25.0976 23.6834 25.0976 24.3166 24.7071 24.7071C24.3166 25.0976 23.6834 25.0976 23.2929 24.7071L16 17.4142L8.70711 24.7071C8.31658 25.0976 7.68342 25.0976 7.29289 24.7071C6.90237 24.3166 6.90237 23.6834 7.29289 23.2929L14.5858 16L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z" fill="#10151F" />
          </svg>
        </div>

        <svg width="77" height="76" viewBox="0 0 77 76" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M38.5 76C59.4868 76 76.5 58.9868 76.5 38C76.5 17.0132 59.4868 0 38.5 0C17.5132 0 0.5 17.0132 0.5 38C0.5 58.9868 17.5132 76 38.5 76Z" fill="#F8F6F7" />
          <path d="M33.3129 53C32.7414 53 32.2413 52.7775 31.8841 52.3641L20.8761 42.6813C20.2689 41.9819 20.4118 40.9963 21.1976 40.4558C21.9834 39.9154 23.0907 40.0426 23.6979 40.742L33.2414 48.7398L53.2796 24.641C53.8511 23.9415 54.994 23.7826 55.7799 24.3231C56.5657 24.8317 56.7443 25.8491 56.137 26.5485L34.7059 52.3324C34.4201 52.7457 33.8844 53 33.3129 53Z" fill="#318A1D" />
        </svg>

        <div className="msg">
          <h2>Congrats</h2>
          <p>Your order is placed successfully</p>
        </div>

        <button className="continueBtn" onClick={() => navigate("/store")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Modal;
