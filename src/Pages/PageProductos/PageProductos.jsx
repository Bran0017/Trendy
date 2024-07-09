import React from 'react';
import ProductsPage from '../../Components/ProductsPage/ProductsPage';
import { Link as Anchor, } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, } from '@fortawesome/free-solid-svg-icons';
import './PageProductos.css'
import HeaderBack from '../../Components/HeaderBack/HeaderBack';
export default function PageProductos() {


    return (
        <div>
            <div style={{
                backgroundImage: '',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '40vh',


            }} className='bgPage'>
                <HeaderBack title='Productos' />
                <Anchor to={`/`}>
                    <FontAwesomeIcon icon={faHome} /> Inicio
                </Anchor>
                |
                <Anchor to=''>
                    Productos
                </Anchor>
            </div>

            <ProductsPage />
        </div>
    );
}
