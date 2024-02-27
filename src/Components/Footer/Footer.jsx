import React, { useEffect, useState, useRef } from 'react';
import './Footer.css'
import { Link as Anchor } from 'react-router-dom';
import logo from '../../images/logo.png'
import baseURL from '../url';
export default function Footer() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        cargarProductos();

    }, []);
    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const categoriasMap = new Map();
                data.productos.forEach(producto => {
                    const categoria = producto.categoria;
                    if (categoriasMap.has(categoria)) {
                        categoriasMap.get(categoria).push(producto);
                    } else {
                        categoriasMap.set(categoria, [producto]);
                    }
                });
                const categoriasArray = Array.from(categoriasMap, ([categoria, productos]) => ({ categoria, productos }));
                setCategorias(categoriasArray?.slice(0, 3));
                setProductos(data.productos?.slice(0, 3));
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };
    return (
        <div className='FooterContain'>
            <div className='footerText'>
                <Anchor to='' target="_blank">   <img src={logo} alt="logo" /></Anchor>
                <div className='socials'>
                    <Anchor to='' target="_blank"><i class='fa fa-instagram'></i></Anchor>
                    <Anchor to='' target="_blank"><i class='fa fa-whatsapp'></i></Anchor>
                    <Anchor to='' target="_blank"><i class='fa fa-share'></i></Anchor>
                </div>
            </div>
            <div className='footerText'>
                <Anchor to='' target="_blank">Restaurante@gmail.com</Anchor>
                <Anchor to='' target="_blank">Salta, Argentina</Anchor>
                <Anchor to='' target="_blank">Avenida, Calle</Anchor>
            </div>
            <div className='footerText'>
                {
                    productos?.map(item => (
                        <Anchor to='' >{item?.titulo}</Anchor>
                    ))
                }

            </div>
            <div className='footerText'>
                {
                    categorias?.map(item => (
                        <Anchor to='' >{item?.categoria}</Anchor>
                    ))
                }
            </div>
        </div>
    )
}
