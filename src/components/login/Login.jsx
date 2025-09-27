import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import Header from '../header/Header';
import { loginUser } from '../userRegister/API/LoginUser';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [apiError, setApiError] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const onSubmit = async (data) => {
        setApiError('');
        try {
            const result = await loginUser(data);

            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            navigate('/store');
        } catch (error) {
            if (error.status === 422 && error.errors) {
                const errorMessages = Object.values(error.errors).flat().join('\n');
                setApiError(errorMessages);
            } else if (error.status === 401) {
                setApiError('Please provide valid API token');
            } else if (error.message) {
                setApiError(error.message);
            } else {
                setApiError('Login failed. Please try again.');
            }
        }
    };

    return (
        <>
            <Header />
            <section className="registerPage">
                <img id="cov" src="Rectangle 10.png" alt="cover" />
                <div className="login">
                    <h1>Log in</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Input */}
                        <div className="inp">
                            <input
                                type="email"
                                placeholder="email *"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        {/* Password Input with Eye Icon */}
                        <div className="inp inputWrapper">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="password *"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Password must be at least 3 characters',
                                    },
                                })}
                            />
                            <span className="toggle-icon" onClick={togglePasswordVisibility}>
                                <img
                                    src={passwordVisible ? '/hide.png' : '/view.png'}
                                    alt="toggle"
                                    className="eye-icon"
                                />
                            </span>
                        </div>
                        {errors.password && <p className="error">{errors.password.message}</p>}

                        {/* API Error */}
                        {apiError && <p className="error">{apiError}</p>}

                        <button type="submit">Log in</button>
                    </form>

                    <p className="member">
                        Not a member? <Link to="/register">Register</Link>
                    </p>
                </div>
            </section>
        </>
    );
};

export default Login;
