import React, { useEffect, useState } from 'react';
import './CardsCantidad.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faImage, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from "react-router-dom";
import baseURL from '../../url';
export default function CardsCantidad() {
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [banners, setBanners] = useState([]);
    const [categorias, setCategoras] = useState([]);
    useEffect(() => {
        cargarProductos();
        cargarUsuarios();
        cargarBanners();
        cargarCategoria();
    }, []);

    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos || []);
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };


    const cargarUsuarios = () => {
        fetch(`${baseURL}/usuariosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setUsuarios(data.usuarios || []);
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    };

    const cargarBanners = () => {
        fetch(`${baseURL}/bannersGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setBanners(data.banner || []);
                console.log(data.banner)
            })
            .catch(error => console.error('Error al cargar banners:', error));
    };


    const cargarCategoria = () => {
        fetch(`${baseURL}/categoriasGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setCategoras(data.categorias || []);
                console.log(data.categorias)
            })
            .catch(error => console.error('Error al cargar contactos:', error));
    };
    return (
        <div className='CardsCantidad'>

            <Anchor to={`/dashboard/usuarios`} className='cardCantidad'>
                <FontAwesomeIcon icon={faUser} className='icons' />
                <div className='deColumn'>

                    <h3>Usuarios</h3>
                    <h2>{usuarios.length}</h2>
                </div>

            </Anchor>
            <Anchor to={`/dashboard/productos`} className='cardCantidad' >
                <FontAwesomeIcon icon={faBook} className='icons' />
                <div className='deColumn'>

                    <h3>Productos</h3>
                    <h2>{productos.length}</h2>
                </div>

            </Anchor>
            <Anchor to={`/dashboard/banners`} className='cardCantidad' >
                <FontAwesomeIcon icon={faImage} className='icons' />
                <div className='deColumn'>

                    <h3>Banners</h3>
                    <h2>{banners.length}</h2>
                </div>

            </Anchor>
            <Anchor to={`/dashboard/categorias`} className='cardCantidad' >
                <FontAwesomeIcon icon={faTachometerAlt} className='icons' />
                <div className='deColumn'>

                    <h3>Categorias</h3>
                    <h2>{categorias.length}</h2>
                </div>

            </Anchor>

        </div>
    )
}
