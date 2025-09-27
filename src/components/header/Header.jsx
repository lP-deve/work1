import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <>
            <header>
                <div className="logo">
                    <img src="HandEye.svg" alt="logo" />
                    <p>RedSeam Clothing</p>
                </div>
                <Link to='/login'><div className="logIn">
                    <img src="user.svg" alt="userIcon" />
                    <p>Log in</p>
                </div></Link>

            </header>



        </>
    )
}

export default Header