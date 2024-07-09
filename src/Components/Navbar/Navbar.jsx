import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import { Link as Anchor } from 'react-router-dom';
import logo from '../../images/logo.png';
import baseURL from '../url';
import 'swiper/swiper-bundle.css';
import Profile from '../Profile/Profile'
import './Navbar.css'

import Favoritos from '../Favoritos/Favoritos'
import InputSerach from '../InputSerach/InputSearchs'
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarBanners();
    }, []);

    const cargarBanners = () => {
        fetch(`${baseURL}/bannersGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const bannerImages = data.banner.map(banner => banner.imagen);
                setImages(bannerImages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar productos:', error)

            });
    };

    return (
        <header>
            <nav>
                <Anchor to={`/`} className='logo'>
                    <img src={logo} alt="logo" />
                </Anchor>

                <div className='deFLexNavs'>

                    <Favoritos />

                    <InputSerach />
                    <div className={`nav_toggle  ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>


                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    className="modalNav"
                    overlayClassName="overlay"
                >
                    <div className="modalNav-content">
                        {loading ? (
                            <div className='loadingBannerFondo'>

                            </div>

                        ) : (

                            <>
                                <div className='fondo'>
                                    <img src={images[0]} alt={`imagen`} />

                                </div>
                                <Profile />
                            </>
                        )}

                    </div>
                </Modal>

            </nav>
        </header>
    );
}
