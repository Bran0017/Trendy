import React from 'react'
import Banners from '../../Components/Banners/Banners'
import Products from '../../Components/Products/Products'
import './Demo.css'
import Footer from '../../Components/Footer/Footer'
import CartFixed from '../../Components/CartFixed/CartFixed'
import BtnWhatsapp from '../../Components/BtnWhatsapp/BtnWhatsapp'
export default function Demo() {
    return (
        <section className='demo'>
            <Banners />
            <Products />
            <Footer />
            <CartFixed />
            <BtnWhatsapp />
        </section>
    )
}
