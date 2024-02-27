import React, { useEffect, useState, useRef } from 'react';
import baseURL from '../url';
import './Products.css';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductosLoading from '../ProductosLoading/ProductosLoading';
SwiperCore.use([Navigation, Pagination, Autoplay]);
export default function Products() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fixedCategories, setFixedCategories] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1); // Estado para la cantidad de productos en el carrito
    const categoriasRefs = useRef([]);
    const categoriasInputRef = useRef(null);
    const swiperRef = useRef(null);
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todo');

    // Función para manejar el clic en una categoría
    const handleClickCategoria = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };
    useEffect(() => {
        cargarProductos();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (window.scrollY > categoriasInputRef.current.offsetTop) {
            setFixedCategories(true);
        } else {
            setFixedCategories(false);
        }
    };

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
                setCategorias(categoriasArray);
                setLoading(false);
                setProductos(data.productos); // Guardamos todos los productos
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

    const scrollToCategoria = (index) => {
        setCategoriaSeleccionada(index);
        categoriasRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    };

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCantidad(1);
    };

    const addToCart = () => {
        if (productoSeleccionado) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(item => item.idProducto === productoSeleccionado.idProducto);

            if (existingItemIndex !== -1) {
                // Si el producto ya existe en el carrito, actualizamos la cantidad
                cart[existingItemIndex].cantidad += cantidad;
            } else {
                // Si el producto no existe en el carrito, lo agregamos
                cart.push({ idProducto: productoSeleccionado.idProducto, cantidad });
            }

            // Actualizamos el carrito en el localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Llamamos a la función openModal() con la información del producto añadido
            openModal({ ...productoSeleccionado, cantidad });

            // Agregamos la llamada a cargarProductos para actualizar la lista de productos en Products
            cargarProductos();
            toast.success('Producto agregado');
        }
    };




    const incrementCantidad = () => {
        setCantidad(cantidad + 1);
    };

    const decrementCantidad = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    };

    return (
        <div className='ProductsContain'>
            <ToastContainer />
            <div className={`categoriasInputs ${fixedCategories ? 'fixed' : ''}`} ref={categoriasInputRef}>

                <input
                    type="button"
                    value="Todo"
                    onClick={() => handleClickCategoria('Todo')}
                    style={{
                        backgroundColor: categoriaSeleccionada === 'Todo' ? '#F80050' : '',
                        color: categoriaSeleccionada === 'Todo' ? '#fff' : '',
                        borderBottom: categoriaSeleccionada === 'Todo' ? '2px solid #F80050' : 'none'
                    }}
                />

                {categorias.map(({ categoria }, index) => (
                    <input
                        key={categoria}
                        type="button"
                        value={categoria}
                        onClick={() => handleClickCategoria(categoria)}
                        style={{
                            backgroundColor: categoriaSeleccionada === categoria ? '#F80050' : '',
                            color: categoriaSeleccionada === categoria ? '#fff' : '',
                            borderBottom: categoriaSeleccionada === categoria ? '2px solid #F80050' : 'none'
                        }}
                    />
                ))}
            </div>
            <div>
                {loading ? (
                    <ProductosLoading />
                ) : (
                    <div >
                        {categoriaSeleccionada === 'Todo' && (
                            <div className='Products'>
                                {productos.some(item => item.masVendido === "si") && (
                                    <div className='categoriSection'>


                                        <Swiper
                                            effect={'coverflow'}
                                            grabCursor={true}
                                            slidesPerView={'auto'}
                                            id='swiper_container_products'
                                        >
                                            {productos.filter(item => item.masVendido === "si").map(item => (
                                                <SwiperSlide id='SwiperSlide-scroll-products-masvendidos' key={item.idProducto}>
                                                    <div className='cardProdcutmasVendido' onClick={() => openModal(item)}>
                                                        <img src={obtenerImagen(item)} alt="imagen" />
                                                        <h6 className='masVendido'>Más Vendido</h6>
                                                        <div className='cardText'>
                                                            <h4>{item.titulo}</h4>
                                                            <p>{item.descripcion}</p>
                                                            <h5>${`${item?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                )}

                                {categorias.map(({ categoria, productos }, index) => (
                                    <div key={categoria} className='categoriSection' ref={ref => categoriasRefs.current[index] = ref}>

                                        <h3 className='title'>{categoria}</h3>
                                        <Swiper
                                            effect={'coverflow'}
                                            grabCursor={true}
                                            slidesPerView={'auto'}
                                            id='swiper_container_products'
                                        >
                                            {productos.map(item => (
                                                <SwiperSlide id='SwiperSlide-scroll-products' key={item.idProducto}>
                                                    <div className='cardProdcut' key={item.idProducto} onClick={() => openModal(item)}>
                                                        <img src={obtenerImagen(item)} alt="imagen" />
                                                        <div className='cardText'>
                                                            <h4>{item.titulo}</h4>
                                                            <p>{item.descripcion}</p>
                                                            <h5>${`${item?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                            <FontAwesomeIcon icon={faAngleDoubleRight} className='iconCard' />
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                ))}
                            </div>
                        )}


                        <div className='categoriSectionSelected'>
                            {productos
                                // Filtra los productos solo para la categoría seleccionada
                                .filter(item => categoriaSeleccionada !== 'Todo' && item.categoria === categoriaSeleccionada)
                                // Mapea para renderizar los productos dentro de la categoría
                                .map(item => (
                                    <div key={item.idProducto}>
                                        <div className='cardProdcutSelected' onClick={() => openModal(item)}>
                                            <img src={obtenerImagen(item)} alt="imagen" />
                                            <div className='cardTextSelected'>
                                                <h4>{item.titulo}</h4>
                                                <p>{item.descripcion}</p>
                                                <h5>${`${item?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                <FontAwesomeIcon icon={faAngleDoubleRight} className='iconCard' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>





                    </div>
                )}

            </div>
            <Modal isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal-detail"
                overlayClassName="overlay-detail">
                {productoSeleccionado && (
                    <div className='modal-content-detail'>
                        <button onClick={closeModal} className='back'>  <FontAwesomeIcon icon={faArrowLeft} /></button>
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            loop={true}
                            slidesPerView={'auto'}
                            coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
                            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                            autoplay={{ delay: 3000 }}
                            pagination={{ clickable: true }}
                            onSwiper={(swiper) => {
                                console.log(swiper);
                                swiperRef.current = swiper;
                            }}
                            id='swiper_container_Imgs'
                        >
                            {productoSeleccionado.imagen1 ? (
                                <SwiperSlide id='SwiperSlide-scroll-img'>
                                    <img src={productoSeleccionado.imagen1} alt="" />
                                </SwiperSlide>
                            ) : (
                                null
                            )}

                            {productoSeleccionado.imagen2 ? (
                                <SwiperSlide id='SwiperSlide-scroll-img'>
                                    <
                                        img src={productoSeleccionado.imagen2} alt="" />
                                </SwiperSlide>
                            ) : (
                                null
                            )}
                            {productoSeleccionado.imagen3 ? (
                                <SwiperSlide id='SwiperSlide-scroll-img'>
                                    <img src={productoSeleccionado.imagen3} alt="" />
                                </SwiperSlide>
                            ) : (
                                null
                            )}
                            {productoSeleccionado.imagen4 ? (
                                <SwiperSlide id='SwiperSlide-scroll-img'>
                                    <img src={productoSeleccionado.imagen4} alt="" />
                                </SwiperSlide>
                            ) : (
                                null
                            )}
                        </Swiper>
                        <div className='modalText'>
                            <h2>{productoSeleccionado.titulo}</h2>
                            <p>{productoSeleccionado.categoria}</p>
                            <p>{productoSeleccionado.descripcion} </p>
                            <h5>${`${productoSeleccionado?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>

                        </div>
                        <div className='deFlexGoTocart'>
                            <div className='deFlexCart'>
                                <button onClick={decrementCantidad}>-</button>
                                <span>{cantidad}</span>
                                <button onClick={incrementCantidad}>+</button>
                            </div>
                            <button onClick={addToCart} className='btn'>Agregar  (  ${`${productoSeleccionado?.precio * cantidad}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} )</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
