import React, { useState } from 'react';
import Login from '../Login/Login';

import './Auth.css';
import logo from '../../../images/logo.png'
import { Link as Anchor } from 'react-router-dom';
export default function Auth() {
    const [showLogin, setShowLogin] = useState(true);

    const toggleComponent = () => {
        setShowLogin((prevShowLogin) => !prevShowLogin);
    };

    return (
        <div className='AuthContainer'>
            <Anchor to={`/`} >
                <img src={logo} alt="Efecto Vial" className='logoAtuh' />
            </Anchor>

            <Login />


        </div>
    );
}
