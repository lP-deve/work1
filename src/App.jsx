import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css'
import Protect from "./components/userRegister/API/Protect";
import Register from './components/userRegister/Register';
import Login from './components/login/Login';
import Home from './components/Store/Home';
import ProductDetail from "./components/productDetails/ProductDetail";
import Checkout from "./components/ChecOutPage/Checkout";
import StoreHeader from "./components/header/StoreHeader";
import Cart from "./components/cartItems/Cart";
import Modal from "./components/ChecOutPage/Modal";

function App() {
  const location = useLocation();

  const [localCart, setLocalCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      localStorage.removeItem("cart");
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(localCart));
  }, [localCart]);

  const isCheckoutPage = location.pathname === "/checkout";

  return (
    <>
      {!["/", "/login", "/register"].includes(location.pathname) && (
        <StoreHeader
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={localCart.reduce((sum, i) => sum + i.quantity, 0)}
        />
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store" element={<Protect><Home /></Protect>} />
        <Route
          path="/products/:id"
          element={<ProductDetail localCart={localCart} setLocalCart={setLocalCart} />}
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              localCart={localCart}
              setLocalCart={setLocalCart}
              setSuccessMessage={setSuccessMessage}
            />
          }
        />
      </Routes>

      {isCartOpen && !["/", "/checkout", "/login", "/register"].includes(location.pathname) && (
  <Cart
    isOpen={isCartOpen}
    onClose={() => setIsCartOpen(false)}
    localCart={localCart}
    setLocalCart={setLocalCart}
    isCheckout={false}
  />
)}



      <Modal message={successMessage} />
    </>
  );
}

export default App;