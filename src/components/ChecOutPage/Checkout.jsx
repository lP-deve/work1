
import React from "react";
import { useForm } from "react-hook-form";
import Cart from "../cartItems/Cart";
import './checkout.css';

const Checkout = ({ localCart, setLocalCart, setSuccessMessage }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onPay = () => {
    setSuccessMessage("Payment successful! Thank you for your order!");
    setLocalCart([]);
    reset(); 
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="checkoutContainer">
      <h1 className="Checkout">Checkout</h1>
      <div className="formBg">
   
        <form className="form" onSubmit={handleSubmit(onPay)} >
          <p>Order details</p>

          <div className="Fullname">
            <div className="nameInput">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: true })}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span  className="error-text">Name is required</span>}
            </div>

            <div className="nameInput">
              <input
                type="text"
                placeholder="Surname"
                {...register("surname", { required: true })}
                className={errors.surname ? "input-error" : ""}
              />
              {errors.surname && <span className="error-text">Surname is required</span>}
            </div>
          </div>
          <div className="emailIcon">
            <svg className="email" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.125 5.625V14.375C18.125 15.4105 17.2855 16.25 16.25 16.25H3.75C2.71447 16.25 1.875 15.4105 1.875 14.375V5.625M18.125 5.625C18.125 4.58947 17.2855 3.75 16.25 3.75H3.75C2.71447 3.75 1.875 4.58947 1.875 5.625M18.125 5.625V5.82726C18.125 6.47837 17.7872 7.08287 17.2327 7.42412L10.9827 11.2703C10.38 11.6411 9.61996 11.6411 9.01732 11.2703L2.76732 7.42412C2.21279 7.08287 1.875 6.47837 1.875 5.82726V5.625"
                stroke="#3E424A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              className={`emailInput ${errors.email ? "input-error" : ""}`}
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
          </div>
          <div className="error-wrapper">{errors.email && <span className="error-text">Email is required</span>}</div>
          

          <div className="address">
            <div className="nameInput">
              <input
                type="text"
                placeholder="Address"
                {...register("address", { required: true })}
                className={errors.address ? "input-error" : ""}
              />
              {errors.address && <span className="error-text">Address is required</span>}
            </div>

            <div className="nameInput">
              <input
                type="text"
                placeholder="Zip Code"
                {...register("zip", { required: true })}
                className={errors.zip ? "input-error" : ""}
              />
              {errors.zip && <span className="error-text">Zip Code is required</span>}
            </div>
          </div>
        </form>


        <div className="cartDiv">
          <Cart
            id="cartSidebar"
            isOpen={true}
            onClose={() => { }}
            localCart={localCart}
            setLocalCart={setLocalCart}
            isCheckout={true}
            onPay={handleSubmit(onPay)}
            payButtonClass="custom-pay-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
