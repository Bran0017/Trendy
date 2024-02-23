import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import baseURL from '../url';
import './Cart.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // Nuevo estado para indicar si el componente está enfocado

    useEffect(() => {
        cargarProductos();
    }, [isFocused]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const promises = cart.map(async (cartItem) => {
                // Filtrar el producto del carrito de todos los productos
                const producto = productos.find(producto => producto.idProducto === cartItem.idProducto);
                return {
                    ...producto,
                    cantidad: cartItem.cantidad,
                };
            });

            Promise.all(promises)
                .then((items) => {
                    setCartItems(items);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error al obtener detalles del carrito:', error);
                    setLoading(false);
                });
        };

        fetchCartItems();
    }, [productos, isFocused]);

    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos || []);
                console.log(data.productos);
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };
    const obtenerImagen = (item) => {
        if (item.imagen1) {
            return item.imagen1;
        } else if (item.imagen2) {
            return item.imagen2;
        } else if (item.imagen3) {
            return item.imagen3;
        } else if (item.imagen4) {
            return item.imagen4;
        }
        return null;
    };
    const openModal = () => {
        setModalIsOpen(true);
        setIsFocused(true); // Cuando se abre el modal, el componente está enfocado
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsFocused(false); // Cuando se cierra el modal, el componente ya no está enfocado
    };
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
    }, 0);
    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(item => item.idProducto !== id);
        setCartItems(updatedCart);
        // Actualizar el local storage con el nuevo carrito
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Función para vaciar el carrito
    const clearCart = () => {
        setCartItems([]);
        // Limpiar el local storage
        localStorage.removeItem('cart');
    };
    return (
        <div>
            <button onClick={openModal} className='cartIcon'><FontAwesomeIcon icon={faShoppingCart} /> </button>
            <Modal
                isOpen={modalIsOpen}
                className="modal-cart"
                overlayClassName="overlay-cart"
                onRequestClose={closeModal}
            >
                <div className='deFLex'>
                    <button onClick={closeModal} >  <FontAwesomeIcon icon={faArrowLeft} /></button>
                    <button onClick={clearCart} className='deleteToCart'>Vaciar carrito</button>
                </div>
                <div className="modal-content-cart">


                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>

                            {cartItems.map((item) => (
                                <div key={item.idProducto} className='cardProductCart'>
                                    <img src={obtenerImagen(item)} alt="imagen" />
                                    <div className='cardProductCartText'>
                                        <h3>{item.titulo}</h3>
                                        <p>Cantidad: {item.cantidad}</p>
                                        <p>Precio: ${item?.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>

                                    </div>
                                    <button onClick={() => removeFromCart(item.idProducto)} className='deleteCart'> X</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='deColumn'>
                    <h4>Total: ${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h4>
                    <button className='btn'>
                        Realizar pedido
                    </button>
                </div>

            </Modal>
        </div>
    );
}
