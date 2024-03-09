import React from 'react'
import './Productos.css'
import Header from '../Header/Header'
import ProductosData from '../../Components/Admin/ProductosData/ProductosData'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
export default function Productos() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <ProductosData />
                </div>
            </section>
        </div>
    )
}
