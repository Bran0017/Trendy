import React, { useEffect, useState, useRef } from 'react';
import './Footer.css'
import { Link as Anchor } from 'react-router-dom';
import logo from '../../images/logo.png'
import baseURL from '../url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
export default function Footer() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [contactos, setContactos] = useState([]);
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

    useEffect(() => {
        cargarContacto();

    }, []);


    const cargarContacto = () => {
        fetch(`${baseURL}/contactoGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setContactos(data.contacto.reverse()[0] || []);
            })
            .catch(error => console.error('Error al cargar contactos:', error));
    };


    return (
        <div className='FooterContain'>
            <div className='footerText'>
                <Anchor to='' target="_blank">   <img src={logo} alt="logo" /></Anchor>
                <h2>
                    {contactos.nombre}
                </h2>
                <div className='socials'>
                    <Anchor to={contactos.instagram} target="_blank"><i className='fa fa-instagram'></i></Anchor>
                    <Anchor to={`tel:${contactos.telefono}`} target="_blank"><i className='fa fa-whatsapp'></i></Anchor>
                    <Anchor to={contactos.facebook} target="_blank"><i className='fa fa-facebook'></i></Anchor>
                    <Anchor to={`/dashboard`} >
                        <FontAwesomeIcon icon={faUser} />
                    </Anchor>
                </div>
            </div>
            <div className='footerText'>
                <h3>Contacto</h3>
                <Anchor to={`mailto:${contactos.email}`} target="_blank">{contactos.email}</Anchor>
                <Anchor to={`tel:${contactos.telefono}`} target="_blank">{contactos.telefono}</Anchor>
                <Anchor to={`https://www.google.com/maps?q=${encodeURIComponent(contactos.direccion)}`} target="_blank">{contactos.direccion}</Anchor>

            </div>
            <div className='footerText'>
                <h3>Productos</h3>
                {
                    productos?.map(item => (
                        <Anchor to='' >{item?.titulo?.slice(0, 33)}</Anchor>
                    ))
                }

            </div>
            <div className='footerText'>
                <h3>Categorias</h3>
                {
                    categorias?.map(item => (
                        <Anchor to='' >{item?.categoria?.slice(0, 30)}</Anchor>
                    ))
                }
            </div>
        </div>
    )
}
