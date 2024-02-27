import React from 'react'
import Banners from '../../Components/Banners/Banners'
import Products from '../../Components/Products/Products'
import './Demo.css'
import Footer from '../../Components/Footer/Footer'
export default function Demo() {
    return (
        <section className='demo'>
            <Banners />
            <Products />
            <Footer />
        </section>
    )
}
