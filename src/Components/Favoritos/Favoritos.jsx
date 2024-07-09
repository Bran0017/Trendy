import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import baseURL from '../url';
import './Favoritos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from "react-router-dom";
export default function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        cargarProductos();
        cargarFavoritos();
    }, [isFocused]);

    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos || []);
                setLoading(false); // Marcamos como cargados los productos
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
                setLoading(false); // En caso de error, marcamos como cargados para evitar bucles
            });
    };

    const cargarFavoritos = () => {
        const storedFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        setFavoritos(storedFavoritos);
    };

    const obtenerImagen = (item) => {
        return item.imagen1 || item.imagen2 || item.imagen3 || item.imagen4 || null;
    };

    const openModal = () => {
        setModalIsOpen(true);
        setIsFocused(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsFocused(false);
    };

    const eliminarProducto = (id) => {
        const updatedFavoritos = favoritos.filter(itemId => itemId !== id);
        setFavoritos(updatedFavoritos);
        localStorage.setItem('favoritos', JSON.stringify(updatedFavoritos));

    };

    return (
        <div>
            <button onClick={openModal} className='cartIcon'><FontAwesomeIcon icon={faHeart} /></button>

            <Modal
                isOpen={modalIsOpen}
                className="modal-cart"
                overlayClassName="overlay-cart"
                onRequestClose={closeModal}
            >
                <div className='deFLex'>
                    <button onClick={closeModal}><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <button onClick={closeModal} className='deleteToCart'>Favoritos</button>
                </div>
                {favoritos?.length === 0 ? (
                    <p className='nohay'>No hay favoritos</p>
                ) : (
                    <div className="modal-content-cart">
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <div>
                                {favoritos.map((id) => {
                                    const producto = productos.find(prod => prod.idProducto === id);
                                    if (!producto) return null;
                                    return (


                                        <div key={producto.idProducto} className='cardProductCart' >
                                            <Anchor to={`/producto/${producto?.idProducto}/${producto?.titulo?.replace(/\s+/g, '-')}`} onClick={closeModal} >
                                                <img src={obtenerImagen(producto)} alt="imagen" />
                                            </Anchor>
                                            <div className='cardProductCartText'>
                                                <h3>{producto.titulo}</h3>
                                                <span>{producto.categoria}</span>
                                                <strong>${producto?.precio?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</strong>

                                            </div>
                                            <button onClick={() => eliminarProducto(id)} className='deleteFav'><FontAwesomeIcon icon={faHeart} /></button>
                                        </div>


                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
