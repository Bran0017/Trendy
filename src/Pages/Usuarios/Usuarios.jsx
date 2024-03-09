import React from 'react'
import './Usuarios.css'
import Header from '../Header/Header'
import UsuariosData from '../../Components/Admin/UsuariosData/UsuariosData'
import HeaderDash from '../../Components/Admin/HeaderDash/HeaderDash'
export default function Usuarios() {
    return (
        <div className='containerGrid'>
            <Header />



            <section className='containerSection'>

                <HeaderDash />
                <div className='container'>
                    <UsuariosData />
                </div>
            </section>
        </div>
    )
}
