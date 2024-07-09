import React, { useEffect, useState, useRef } from 'react';
import baseURL from '../url';
import './Products.css';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faAngleDoubleRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductosLoading from '../ProductosLoading/ProductosLoading';
import { Link as Anchor } from "react-router-dom";
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
    const [favoritos, setFavoritos] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    // Función para manejar el clic en una categoría
    const handleClickCategoria = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };
    useEffect(() => {
        cargarFavoritos();
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

    const openModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalIsOpen(true);
        const cargarFavoritos = () => {
            const storedFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            setFavoritos(storedFavoritos);
        };
        cargarFavoritos()
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCantidad(1);
        setSelectedItem('')
    };
    const cargarFavoritos = () => {
        const storedFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        setFavoritos(storedFavoritos);
    };

    const addToCart = () => {
        if (productoSeleccionado) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Verificar si existe un producto con el mismo ID en el carrito
            const existingItemIndex = cart.findIndex(item =>
                item.idProducto === productoSeleccionado.idProducto
            );

            if (existingItemIndex !== -1) {
                // Si el producto ya existe en el carrito, agregamos el nuevo sabor al array de sabores
                const existingItem = cart[existingItemIndex];
                const updatedSabores = [...existingItem.talle, selectedItem]; // Agregar el nuevo sabor

                // Actualizar la cantidad del producto existente en el carrito
                const updatedCantidad = existingItem.cantidad + cantidad;

                // Actualizar el producto existente en el carrito con el nuevo sabor y cantidad
                cart[existingItemIndex] = { ...existingItem, talle: updatedSabores, cantidad: updatedCantidad };
            } else {
                // Si el producto no existe en el carrito, lo agregamos con el sabor seleccionado
                cart.push({ idProducto: productoSeleccionado.idProducto, talle: [selectedItem], cantidad });
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

    const agregarAFavoritos = (idProducto) => {
        const favList = [...favoritos];
        const index = favList.indexOf(idProducto);
        if (index === -1) {
            // Si el producto no está en favoritos, lo agregamos
            favList.push(idProducto);
            setFavoritos(favList);
            localStorage.setItem('favoritos', JSON.stringify(favList));
            console.log('Producto agregado a favoritos');

        } else {
            // Si el producto está en favoritos, lo eliminamos
            favList.splice(index, 1);
            setFavoritos(favList);
            localStorage.setItem('favoritos', JSON.stringify(favList));
            console.log('Producto eliminado de favoritos');
        }
    };
    return (
        <div className='ProductsContain'>
            <ToastContainer />
            <div className={`categoriasInputs ${fixedCategories ? 'fixed' : ''}`} ref={categoriasInputRef}>

                {categorias.length > 0 &&
                    <input
                        type="button"
                        value="Todo"
                        onClick={() => handleClickCategoria('Todo')}
                        style={{
                            backgroundColor: categoriaSeleccionada === 'Todo' ? '#0c71cf' : '',
                            color: categoriaSeleccionada === 'Todo' ? '#fff' : '',
                            borderBottom: categoriaSeleccionada === 'Todo' ? '2px solid #0c71cf' : 'none'
                        }}
                    />
                }


                {categorias.map(({ categoria }, index) => (
                    <input
                        key={categoria}
                        type="button"
                        value={categoria}
                        onClick={() => handleClickCategoria(categoria)}
                        style={{
                            backgroundColor: categoriaSeleccionada === categoria ? '#0c71cf' : '',
                            color: categoriaSeleccionada === categoria ? '#fff' : '',
                            borderBottom: categoriaSeleccionada === categoria ? '2px solid #0c71cf' : 'none'
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
                                            autoplay={{ delay: 3000 }}
                                        >
                                            {productos.filter(item => item.masVendido === "si").map(item => (
                                                <SwiperSlide id='SwiperSlide-scroll-products-masvendidos' key={item.idProducto}>
                                                    <Anchor className='cardProdcutmasVendido' to={`/producto/${item.idProducto}/${item.titulo.replace(/\s+/g, '-')}`}>
                                                        <img src={obtenerImagen(item)} alt="imagen" />
                                                        <h6 className='masVendido'>Más Vendido</h6>
                                                        <div className='cardText'>
                                                            <h4>{item.titulo}</h4>
                                                            <span>{item.descripcion}</span>
                                                            <div className='deFLexPrice'>
                                                                <h5> ${String(item?.precio)?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                                {
                                                                    (item.precioAnterior !== 0 && item.precioAnterior !== undefined) && (
                                                                        <h5 className='precioTachado'>${`${item?.precioAnterior}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                                    )
                                                                }
                                                            </div>


                                                        </div>
                                                    </Anchor>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                )}

                                {categorias.map(({ categoria, productos }, index) => (
                                    <div key={categoria} className='categoriSection' ref={ref => categoriasRefs.current[index] = ref}>

                                        <div className='deFlexTitlesection'>
                                            <h3 >{categoria}</h3>
                                            <button onClick={() => {
                                                handleClickCategoria(categoria);
                                                document.querySelector('.categoriSection').scrollIntoView({ behavior: 'smooth' });
                                            }}>
                                                Ver más
                                            </button>
                                        </div>

                                        <Swiper
                                            effect={'coverflow'}
                                            grabCursor={true}
                                            slidesPerView={'auto'}
                                            id='swiper_container_products'
                                        >
                                            {productos.map(item => (
                                                <SwiperSlide id='SwiperSlide-scroll-products' key={item.idProducto}>
                                                    <Anchor className='cardProdcut' key={item.idProducto} to={`/producto/${item.idProducto}/${item.titulo.replace(/\s+/g, '-')}`}>
                                                        <img src={obtenerImagen(item)} alt="imagen" />
                                                        <div className='cardText'>
                                                            <h4>{item.titulo}</h4>
                                                            <span>{item.descripcion}</span>
                                                            <div className='deFLexPrice'>
                                                                <h5> ${String(item?.precio)?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                                {
                                                                    (item.precioAnterior !== 0 && item.precioAnterior !== undefined) && (
                                                                        <h5 className='precioTachado'>${`${item?.precioAnterior}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                                    )
                                                                }
                                                            </div>

                                                            <FontAwesomeIcon icon={faAngleDoubleRight} className='iconCard' />
                                                        </div>
                                                    </Anchor>
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
                                    <Anchor key={item.idProducto} to={`/producto/${item.idProducto}/${item.titulo.replace(/\s+/g, '-')}`} >

                                        <div className='cardProdcutSelected' onClick={() => openModal(item)}>
                                            <img src={obtenerImagen(item)} alt="imagen" />
                                            <div className='cardTextSelected'>
                                                <h4>{item.titulo}</h4>
                                                <span>{item.descripcion}</span>
                                                <div className='deFLexPrice'>
                                                    <h5> ${String(item?.precio)?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                    {
                                                        (item.precioAnterior !== 0 && item.precioAnterior !== undefined) && (
                                                            <h5 className='precioTachado'>${`${item?.precioAnterior}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                                        )
                                                    }
                                                </div>

                                                <FontAwesomeIcon icon={faAngleDoubleRight} className='iconCard' />
                                            </div>
                                        </div>
                                    </Anchor>
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
                        <div className='backFLex'>
                            <button onClick={closeModal} className='back'>  <FontAwesomeIcon icon={faArrowLeft} /></button>
                            <button onClick={() => agregarAFavoritos(productoSeleccionado.idProducto)} className='favoritos-btn'>
                                <FontAwesomeIcon icon={faHeart} style={{ color: favoritos.includes(productoSeleccionado.idProducto) ? 'red' : 'gray' }} />
                            </button>
                        </div>
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
                            <div className='deFLexPrice'>
                                <h5>${`${productoSeleccionado?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                {
                                    (productoSeleccionado.precioAnterior !== 0 && productoSeleccionado.precioAnterior !== undefined) && (
                                        <h5 className='precioTachado'>${`${productoSeleccionado?.precioAnterior}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                    )
                                }
                            </div>

                            <div className='itemsDetail'>


                                {productoSeleccionado.item1 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item1}
                                            checked={selectedItem === productoSeleccionado.item1}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item1}
                                    </label>
                                )}
                                {productoSeleccionado.item2 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item2}
                                            checked={selectedItem === productoSeleccionado.item2}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item2}
                                    </label>
                                )}
                                {productoSeleccionado.item3 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item3}
                                            checked={selectedItem === productoSeleccionado.item3}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item3}
                                    </label>
                                )}
                                {productoSeleccionado.item4 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item4}
                                            checked={selectedItem === productoSeleccionado.item4}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item4}
                                    </label>
                                )}
                                {productoSeleccionado.item5 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item5}
                                            checked={selectedItem === productoSeleccionado.item5}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item5}
                                    </label>
                                )}
                                {productoSeleccionado.item6 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item6}
                                            checked={selectedItem === productoSeleccionado.item6}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item6}
                                    </label>
                                )}
                                {productoSeleccionado.item7 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item7}
                                            checked={selectedItem === productoSeleccionado.item7}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item7}
                                    </label>
                                )}
                                {productoSeleccionado.item8 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item8}
                                            checked={selectedItem === productoSeleccionado.item8}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item8}
                                    </label>
                                )}
                                {productoSeleccionado.item9 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item9}
                                            checked={selectedItem === productoSeleccionado.item9}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item9}
                                    </label>
                                )}
                                {productoSeleccionado.item10 && (
                                    <label>
                                        <input
                                            type="radio"
                                            name="talle"
                                            value={productoSeleccionado.item10}
                                            checked={selectedItem === productoSeleccionado.item10}
                                            onChange={(e) => setSelectedItem(e.target.value)}
                                        />
                                        {productoSeleccionado.item10}
                                    </label>
                                )}
                            </div>

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
