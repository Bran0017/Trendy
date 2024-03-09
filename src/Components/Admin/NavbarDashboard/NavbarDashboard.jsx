import React, { useState, useEffect } from 'react'
import './NavbarDashboard.css'
import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBook, faImage, faAddressBook, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../images/logo.png'
import Logout from '../Logout/Logout';

export default function Navbar() {
    const location = useLocation();


    return (

        <div class="navbarDashboard" >


            <Anchor className='logo'>
                <img src={logo} alt="Efecto vial Web logo" />

            </Anchor>


            <div className='links'>
                <Anchor to={`/dashboard`} className={location.pathname === '/dashboard' ? 'activeLink' : ''}><FontAwesomeIcon icon={faHome} /> Inicio</Anchor>
                <Anchor to={`/dashboard/productos`} className={location.pathname === '/dashboard/productos`' ? 'activeLink' : ''} ><FontAwesomeIcon icon={faBook} /> Productos</Anchor>
                <Anchor to={`/dashboard/banners`} className={location.pathname === '/dashboard/banners' ? 'activeLink' : ''}><FontAwesomeIcon icon={faImage} /> Banners</Anchor>
                <Anchor to={`/dashboard/usuarios`} className={location.pathname === '/dashboard/usuarios' ? 'activeLink' : ''}><FontAwesomeIcon icon={faUser} /> Usuarios</Anchor>
                <Anchor to={`/dashboard/contacto`} className={location.pathname === '/dashboard/contacto' ? 'activeLink' : ''}><FontAwesomeIcon icon={faAddressBook} /> Contacto</Anchor>


            </div>

            <Logout />

        </div>



    );
}
