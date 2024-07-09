import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import baseURL from '../url';
import './Cart.css';
import whatsappIcon from '../../images/wpp.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from "react-router-dom";
export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [codigo, setCodigo] = useState('');
    const [contactos, setContactos] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [codigoValido, setCodigoValido] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [deliveryOption, setDeliveryOption] = useState('delivery');
    useEffect(() => {
        cargarContacto();
    }, []);
    useEffect(() => {
        // Calcular el precio total al cargar el carrito o al actualizar los productos
        let totalPriceCalc = 0;
        cartItems.forEach(item => {
            totalPriceCalc += item.precio * item.cantidad;
        });
        setTotalPrice(totalPriceCalc);
    }, [cartItems]);

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

    useEffect(() => {
        cargarProductos();
    }, [isFocused]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const promises = cart.map(async (cartItem) => {
                const producto = productos.find(producto => producto.idProducto === cartItem.idProducto);
                return {
                    ...producto,
                    cantidad: cartItem.cantidad,
                    item: cartItem.item,
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
            })
            .catch(error => console.error('Error al cargar productos:', error));
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

    const openModal2 = () => {
        setModalIsOpen2(true);
    };

    const closeModal2 = () => {
        setModalIsOpen2(false);
    };

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(item => item.idProducto !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const [codigos, setCodigos] = useState([]);

    useEffect(() => {
        cargarCodigos();

    }, []);

    const cargarCodigos = () => {
        fetch(`${baseURL}/codigosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setCodigos(data.codigos || []);
            })
            .catch(error => console.error('Error al cargar códigos:', error));
    };

    const handleWhatsappMessage = () => {
        const codigoDescuento = codigos.find(item => item.codigo === codigo);
        let descuentoActualizado = 0;

        if (codigoDescuento) {
            descuentoActualizado = codigoDescuento.descuento;
            setCodigoValido(true);
        } else {
            setCodigoValido(false);
        }

        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += item.precio * item.cantidad;
        });

        // Aplicar descuento y asegurarse de que el precio no sea negativo
        let totalPriceWithDiscount = totalPrice - descuentoActualizado;
        if (totalPriceWithDiscount < 0) {
            totalPriceWithDiscount = 0; // O cualquier otro manejo que desees
        }

        const formattedTotalPrice = totalPriceWithDiscount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        const phoneNumber = `${contactos.telefono}`;

        const cartDetails = cartItems.map((item) => (
            `\n*${item.titulo}* \n Cantidad: ${item.cantidad} \n ${item?.item}\n Precio: $${item.precio?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n`
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
        if (codigo.trim() !== '') {
            noteMessage += `\nCodigo : ${codigo}
            \nDescuento de : $${descuentoActualizado?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            `;
        }

        const paymentMessage = paymentMethod === 'efectivo' ? 'Pago en efectivo' : 'Pago por transferencia bancaria';
        const paymentMessage2 = deliveryOption === 'delivery' ? 'Envio a domicilio' : 'Retiro personalmente';


        const message = `¡Hola! 🌟 Estoy interesado en encargar:\n\n${cartDetails.join('')}\n${noteMessage}\n${paymentMessage2}\n${paymentMessage}\nTotal: $${formattedTotalPrice}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
        setName('');
        setLocation('');
        setNoteText('');
        setCodigo('');
        setDescuento(descuentoActualizado);
        setModalIsOpen(false);
        setModalIsOpen2(false);
    };

    // Función para aumentar la cantidad de un producto en el carrito
    const increaseQuantity = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].cantidad += 1;
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    };

    // Función para disminuir la cantidad de un producto en el carrito
    const decreaseQuantity = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].cantidad > 1) {
            updatedCartItems[index].cantidad -= 1;
            setCartItems(updatedCartItems);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        }
    };
    return (
        <div>

            <button onClick={openModal} className='cartIconFixed'>
                {
                    cartItems?.length >= 1 && (
                        <span>{cartItems.length}</span>
                    )

                }
                <FontAwesomeIcon icon={faShoppingCart} />
            </button>

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

                                    {cartItems.map((item, index) => (
                                        <div key={item?.idProducto} className='cardProductCart' >
                                            <Anchor to={`/producto/${item?.idProducto}/${item?.titulo?.replace(/\s+/g, '-')}`} onClick={closeModal}>
                                                <img src={obtenerImagen(item)} alt="imagen" />
                                            </Anchor>
                                            <div className='cardProductCartText'>
                                                <h3>{item.titulo}</h3>
                                                <span>
                                                    {item?.item?.map((sabor, index) => (
                                                        <span key={index}> {sabor}</span>
                                                    ))}
                                                </span>
                                                <strong>${item?.precio?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</strong>
                                            </div>
                                            <div className='deColumn'>
                                                <button onClick={() => removeFromCart(item.idProducto)} className='deleteCart'>  <FontAwesomeIcon icon={faTrash} /></button>
                                                <div className='deFlexCantidad'>
                                                    <button onClick={() => decreaseQuantity(index)}>-</button>
                                                    <span>{item.cantidad}</span>
                                                    <button onClick={() => increaseQuantity(index)}>+</button>
                                                </div>
                                            </div>
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
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Nombre (opcional)'
                                />


                                <div className='deFLexRadio'>
                                    <label>Opciones de entrega</label>

                                    <div>
                                        <input
                                            type="radio"
                                            id="delivery"
                                            name="deliveryOption"
                                            value="delivery"
                                            checked={deliveryOption === 'delivery'}
                                            onChange={() => setDeliveryOption('delivery')}
                                        />
                                        <label htmlFor="delivery">Envío a domicilio</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id="pickup"
                                            name="deliveryOption"
                                            value="pickup"
                                            checked={deliveryOption === 'pickup'}
                                            onChange={() => setDeliveryOption('pickup')}
                                        />
                                        <label htmlFor="pickup">Retirar personalmente</label>
                                    </div>
                                </div>

                                <div className='deFLexRadio'>
                                    <label>Formas de pago</label>
                                    <div >
                                        <input
                                            type="radio"
                                            id="efectivo"
                                            name="paymentMethod"
                                            value="efectivo"
                                            checked={paymentMethod === 'efectivo'}
                                            onChange={() => setPaymentMethod('efectivo')}
                                        />
                                        <label htmlFor="efectivo">Efectivo</label>
                                    </div>
                                    <div >
                                        <input
                                            type="radio"
                                            id="transferencia"
                                            name="paymentMethod"
                                            value="transferencia"
                                            checked={paymentMethod === 'transferencia'}
                                            onChange={() => setPaymentMethod('transferencia')}
                                        />
                                        <label htmlFor="transferencia">Transferencia</label>
                                    </div>

                                </div>
                                <input
                                    type="text"
                                    id="codigo"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                    placeholder='Codigo de descuento (opcional)'
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
