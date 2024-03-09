import React from 'react'
import './Banners.css'
import Header from '../Header/Header'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
import BannerData from '../../Components/Admin/BannerData/BannerData'
export default function Banners() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <BannerData />
                </div>
            </section>
        </div>
    )
}
