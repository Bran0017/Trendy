import React, { useEffect, useState, useRef } from 'react';
import baseURL from '../url';
import './Products.css';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
SwiperCore.use([Navigation, Pagination, Autoplay]);
export default function Products() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [fixedCategories, setFixedCategories] = useState(false);
    const categoriasRefs = useRef([]);
    const categoriasInputRef = useRef(null);
    const swiperRef = useRef(null);
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
            // setCategoriaSeleccionada(null); // Deseleccionar la categoría cuando vuelva a ser relativa
        }
    };


    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                // Agrupar productos por categoría
                const categoriasMap = new Map();
                data.productos.forEach(producto => {
                    const categoria = producto.categoria;
                    if (categoriasMap.has(categoria)) {
                        categoriasMap.get(categoria).push(producto);
                    } else {
                        categoriasMap.set(categoria, [producto]);
                    }
                });
                // Convertir Map a array de objetos para el estado
                const categoriasArray = Array.from(categoriasMap, ([categoria, productos]) => ({ categoria, productos }));
                setCategorias(categoriasArray);
                setLoading(false);
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

    return (
        <div className='ProductsContain'>
            <div className={`categoriasInputs ${fixedCategories ? 'fixed' : ''}`} ref={categoriasInputRef}>
                {categorias.map(({ categoria }, index) => (
                    <input
                        key={categoria}
                        type="button"
                        value={categoria}
                        onClick={() => scrollToCategoria(index)}
                        style={{
                            color: categoriaSeleccionada === index ? '#F80050' : '',
                            borderBottom: categoriaSeleccionada === index ? '2px solid #F80050' : 'none'
                        }}
                    />
                ))}
            </div>
            <div >
                {loading ? (
                    <div className='loadingBanner'></div>
                ) : (
                    <div className='Products' style={{ paddingTop: categoriasInputRef.current ? categoriasInputRef.current.clientHeight : 100 }}>
                        {categorias.map(({ categoria, productos }, index) => (
                            <div key={categoria} className='categoriSection' ref={ref => categoriasRefs.current[index] = ref}>
                                <h3>{categoria}</h3>

                                <Swiper
                                    effect={'coverflow'}
                                    grabCursor={true}
                                    loop={true}
                                    slidesPerView={'auto'}
                                    id='swiper_container_products'
                                >
                                    {productos.map(item => (
                                        <SwiperSlide id='SwiperSlide-scroll-products' key={index}>
                                            <div className='cardProdcut' key={item.idProducto}>
                                                <img src={obtenerImagen(item)} alt="imagen" />
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
                        ))}
                    </div>
                )}

                <div className='espacio'>

                </div>
            </div>
        </div>
    );
}
