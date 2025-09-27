import React from "react";

const Modal = ({ message, onClose }) => {
  if (!message) return null;

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
      <div style={{
        background: "white",
        padding: "30px 40px",
        borderRadius: "8px",
        textAlign: "center",
        maxWidth: "400px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
      }}>
        <h2>Success</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Modal; 
