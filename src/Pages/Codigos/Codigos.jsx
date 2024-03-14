import React from 'react'
import Header from '../Header/Header'
import CodigosData from '../../Components/Admin/CodigosData/CodigosData'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
export default function Codigos() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <CodigosData />
                </div>
            </section>
        </div>
    )
}

