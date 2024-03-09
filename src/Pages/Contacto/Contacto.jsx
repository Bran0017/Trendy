import React from 'react'
import './Contacto.css'
import Header from '../Header/Header'
import ContactoData from '../../Components/Admin/ContactoData/ContactoData'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
export default function Contacto() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <ContactoData />
                </div>
            </section>
        </div>
    )
}

