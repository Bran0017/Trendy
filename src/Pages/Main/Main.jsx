import React from 'react'
import './Main.css'
import Header from '../Header/Header'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
import ProductosMain from '../../Components/Admin/ProductosMain/ProductosMain'
import UsuariosMain from '../../Components/Admin/UsuariosMain/UsuariosMain'
import CardsCantidad from '../../Components/Admin/CardsCantidad/CardsCantidad'
import InfoUserMain from '../../Components/Admin/InfoUserMain/InfoUserMain'
export default function Main() {
    return (
        <div className='containerGrid'>
            <Header />

            <section className='containerSection'>
                <HeaderDash />
                <div className='containerMain'>
                    <div className='deFLexMain'>
                        <CardsCantidad />
                        <UsuariosMain />
                    </div>
                    <div className='deFLexMain'>
                        <ProductosMain />
                        <InfoUserMain />
                    </div>


                </div>
            </section>
        </div>
    )
}
