import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link as Anchor } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo.png';
import fondo from '../../images/Fondo.png';
import './NavbarProfile.css'
export default function NavbarProfile() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className='navbarProfile'>
            <nav >
                <Anchor to={`/`} className='logo'>
                    <img src={logo} alt="Efecto vial Web logo" />
                </Anchor>

                <div className='enlaces2'>
                    <Anchor to={`/`} >Inicio</Anchor>
                    <Anchor to={`/demo`} >Demo</Anchor>
                </div>

                <div className='deFlexnav'>
                    <div className={`nav_toggle  ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <div className="modal-content">
                        <Anchor to={`/`} className='fondo'>
                            <img src={fondo} alt=" Efecto vial Web" />
                        </Anchor>

                        <div className='enlaces'>
                            <Anchor to={`/`}><FontAwesomeIcon icon={faHome} className='icon' /> Inicio</Anchor>
                            <Anchor to={`/demo`}><FontAwesomeIcon icon={faHome} className='icon' /> Demo</Anchor>
                        </div>
                    </div>
                </Modal>

            </nav>
        </header>
    );
}
