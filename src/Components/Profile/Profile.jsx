import React, { useEffect, useState, useRef } from 'react';
import logo from '../../images/logo.png'
import './Profile.css'
import { Link as Anchor } from 'react-router-dom';
import baseURL from '../url';
export default function Profile() {
    const [contactos, setContactos] = useState([]);

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
        <div className='profileContain'>
            <img src={logo} alt="" />
            <h2>{contactos.nombre}</h2>
            <div className='socials'>
                <Anchor to={contactos.instagram} target="_blank"><i className='fa fa-instagram'></i></Anchor>
                <Anchor to={`tel:${contactos.telefono}`} target="_blank"><i className='fa fa-whatsapp'></i></Anchor>
                <Anchor to={contactos.facebook} target="_blank"><i className='fa fa-facebook'></i></Anchor>
            </div>
            <div className='profileText'>
                <Anchor to={`mailto:${contactos.email}`} target="_blank">{contactos.email}</Anchor>
                <Anchor to={`https://www.google.com/maps?q=${encodeURIComponent(contactos.direccion)}`} target="_blank">{contactos.direccion}</Anchor>

            </div>
        </div>
    )
}
