import React from 'react'
import './ProductosLoading.css'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
SwiperCore.use([Navigation, Pagination, Autoplay]);
export default function ProductosLoading() {
    return (
        <div className='loadingContain'>

            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                slidesPerView={'auto'}
                className='cardsLoading'
            >

                <SwiperSlide className='cardLoading' >

                </SwiperSlide>
                <SwiperSlide className='cardLoading' >

                </SwiperSlide>

                <SwiperSlide className='cardLoading' >

                </SwiperSlide>
                <SwiperSlide className='cardLoading' >

                </SwiperSlide>
                <SwiperSlide className='cardLoading' >

                </SwiperSlide>

            </Swiper>


            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                slidesPerView={'auto'}
                className='cardsLoading2'
            >

                <SwiperSlide className='cardLoading2' >

                </SwiperSlide>
                <SwiperSlide className='cardLoading2' >

                </SwiperSlide>

                <SwiperSlide className='cardLoading2' >

                </SwiperSlide>
                <SwiperSlide className='cardLoading2' >

                </SwiperSlide>
                <SwiperSlide className='cardLoading2' >

                </SwiperSlide>

            </Swiper>
        </div>
    )
}
