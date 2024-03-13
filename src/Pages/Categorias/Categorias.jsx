import React from 'react'
import Header from '../Header/Header'
import CategoriasData from '../../Components/Admin/CategoriasData/CategoriasData'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
export default function Categorias() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <CategoriasData />
                </div>
            </section>
        </div>
    )
}

