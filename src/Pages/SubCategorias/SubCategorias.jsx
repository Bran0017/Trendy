import React from 'react'
import Header from '../Header/Header'
import SubCategoriasData from '../../Components/Admin/SubCategoriasData/SubCategoriasData'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
export default function SubCategorias() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <SubCategoriasData />
                </div>
            </section>
        </div>
    )
}

