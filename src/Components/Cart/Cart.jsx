import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import baseURL from '../url';
import './Cart.css';
import whatsappIcon from '../../images/wpp.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // Nuevo estado para indicar si el componente está enfocado
    const [noteText, setNoteText] = useState('');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
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
    const openModal2 = () => {
        setModalIsOpen2(true);
    };

    const closeModal2 = () => {
        setModalIsOpen2(false);
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
    const handleWhatsappMessage = () => {
        const phoneNumber = '3875683101'; // Reemplaza con el número de teléfono al que deseas enviar el mensaje

        const cartDetails = cartItems.map((item) => (
            `\n*${item.titulo}* - Cantidad: ${item.cantidad}
Precio: $${item.precio}\n`
        ));

        let noteMessage = '';

        if (location.trim() !== '') {
            noteMessage += `\nUbicación: ${location}`;
        }

        if (name.trim() !== '') {
            noteMessage += `\nNombre: ${name}`;
        }

        if (noteText.trim() !== '') {
            noteMessage += `\nNota: ${noteText}`;
        }

        const message = `¡Hola! 🌟 Estoy interesado en encargar:\n\n${cartDetails.join('')}\nTotal: $${totalPrice}\n${noteMessage}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
        setName('')
        setLocation('')
        setNoteText('')
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
                    <button onClick={closeModal} ><FontAwesomeIcon icon={faArrowLeft} />  </button>
                    <button onClick={clearCart} className='deleteToCart'>Vaciar carrito</button>
                </div>
                {cartItems?.length === 0 ?
                    (<p className='nohay'> No hay productos</p>)
                    : (<>
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
                                                <p>Precio: ${item?.precio?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>

                                            </div>
                                            <button onClick={() => removeFromCart(item.idProducto)} className='deleteCart'>  <FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='deColumnCart'>
                            <h4>Total: ${totalPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h4>
                            <div className='deFLexBtns'>

                                <button className='btnWpp' onClick={openModal2}>
                                    Pedir por  WhatsApp<img src={whatsappIcon} alt="WhatsApp" />
                                </button>

                            </div>
                        </div>

                        <Modal
                            isOpen={modalIsOpen2}
                            onRequestClose={closeModal2}
                            className="modal-cart"
                            overlayClassName="overlay-cart"
                        >
                            <div className='deFLex'>
                                <button onClick={closeModal2} ><FontAwesomeIcon icon={faArrowLeft} />  </button>
                                <h4>Agregar Detalles</h4>
                            </div>
                            <div className="modal-send-form">

                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder='Ubicación (opcional)'
                                />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Nombre (opcional)'
                                />
                                <textarea
                                    placeholder="Agrega una nota (opcional)"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                />
                                <button onClick={handleWhatsappMessage} className='btn'>Enviar</button>

                            </div>

                        </Modal>

                    </>)}

            </Modal>
        </div >
    );
}
