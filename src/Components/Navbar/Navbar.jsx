import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import { Link as Anchor } from 'react-router-dom';
import logo from '../../images/logo.png';
import baseURL from '../url';
import 'swiper/swiper-bundle.css';
import Profile from '../Profile/Profile'
import './Navbar.css'
import Cart from '../Cart/Cart'
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
                    <img src={logo} alt="Efecto vial Web logo" />
                </Anchor>

                <div className='deFLexNav'>
                    <Cart />

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
                        {loading ? (
                            <div className='loadingBanner'>

                            </div>

                        ) : (

                            <div className='fondo'>
                                <img src={images[0]} alt={`imagen`} />
                                <Profile />
                            </div>

                        )}

                    </div>
                </Modal>

            </nav>
        </header>
    );
}
