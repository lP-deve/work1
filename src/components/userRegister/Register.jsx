import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UploadImg from './UploadImg';
import Header from '../header/Header';
import { registerUser } from './API/RegisterUser';
import './Register.css';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (formData) => {
    try {
      const data = await registerUser(formData);

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: messages[0]
          });
        });
      }
    }
  };

  const password = watch('password');

  return (
    <>
      <Header />
      <section className="registerPage">
        <img id="cov" src="Rectangle 10.png" alt="cover" />
        <div className="registration">
          <h1>Registration</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <UploadImg />

            <div className="inp1">
              <input
                className={errors.username ? 'error-input' : ''}
                type="text"
                {...register('username', {
                  required: 'Username is required',
                })}
                placeholder="Username *"
                
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>

            <div className="inp1">
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                 
                  }
                })}
                placeholder="   Email     *"
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className="inp1">
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 3,
                      message: 'Password must be at least 3 characters'
                    }
                  })}
                  placeholder="Password *"
                  className={`password-input ${errors.password ? 'error-input' : ''}`}
                />
                {errors.password && <p>{errors.password.message}</p>}
                <span className="toggle-icons2" onClick={togglePasswordVisibility}>
                  <img
                    src={passwordVisible ? '/hide.png' : '/view.png'}
                    alt="toggle"
                    id={passwordVisible ? 'hide' : 'see'}
                  />
                </span>
              </div>
            </div>

            <div className="inp1">
              <div className="password-wrappers">
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match'
                  })}
                  placeholder="Confirm Password *"
                  className={`password-input ${errors.confirmPassword ? 'error-input' : ''}`}
                />
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
                <span className="toggle-icons" onClick={toggleConfirmPasswordVisibility}>
                  <img
                    src={confirmPasswordVisible ? '/hide.png' : '/view.png'}
                    alt="toggle"
                    id={confirmPasswordVisible ? 'hide1' : 'see1'}
                  />
                </span>
              </div>
            </div>

            <button type="submit">Register</button>
          </form>

          <p className="member">
            Already a member? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Register;
