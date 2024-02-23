import React, { useEffect, useState, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../url';
import './Banners.css';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function Banners() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef(null);

    useEffect(() => {
        cargarBanners();
    }, []);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current?.update();
        }
    }, [images]);

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
        <div className='BannerContain'>

            {loading ? (
                <div className='loadingBanner'>

                </div>

            ) : (
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    loop={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
                    navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    onSwiper={(swiper) => {
                        console.log(swiper);
                        swiperRef.current = swiper;
                    }}
                    id='swiper_container'
                >
                    {images.map((image, index) => (
                        <SwiperSlide id='SwiperSlide-scroll' key={index}>
                            <img src={image} alt={`imagen-${index}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
