import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowUp, faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import './ProductosData.css'
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import baseURL from '../../url';
import NewProduct from '../NewProduct/NewProduct';
export default function ProductosData() {
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoTitulo, setNuevoTitulo] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [nuevoPrecioAnterior, setNuevoPrecioAnterior] = useState(0);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [nuevaSubCategoria, setNuevaSubCategoria] = useState('');
    const [producto, setProducto] = useState({});
    const [modalImagenVisible, setModalImagenVisible] = useState(false);
    const [imagenSeleccionada, setImagenSeleccionada] = useState('');
    const [filtroId, setFiltroId] = useState('');
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroCategoria2, setFiltroCategoria2] = useState('');
    const [filtroMasVendido, setFiltroMasVendido] = useState('');
    const [filtroSubCategoria, setFiltroSubCategoria] = useState('');
    const [ordenInvertido, setOrdenInvertido] = useState(false);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [imagenPreview2, setImagenPreview2] = useState(null);
    const [imagenPreview3, setImagenPreview3] = useState(null);
    const [imagenPreview4, setImagenPreview4] = useState(null);
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [nuevaImagen2, setNuevaImagen2] = useState(null);
    const [nuevaImagen3, setNuevaImagen3] = useState(null);
    const [nuevaImagen4, setNuevaImagen4] = useState(null);
    const [selectedSection, setSelectedSection] = useState('texto');
    const [nuevoMasVendido, setNuevoMasVendido] = useState('');
    const [categorias, setCategoras] = useState([]);
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');
    const [item3, setItem3] = useState('');
    const [item4, setItem4] = useState('');
    const [item5, setItem5] = useState('');
    const [item6, setItem6] = useState('');
    const [item7, setItem7] = useState('');
    const [item8, setItem8] = useState('');
    const [item9, setItem9] = useState('');
    const [item10, setItem10] = useState('');
    const [nuevoStock, setNuevoStock] = useState('');
    const [subcategorias, setSubCategorias] = useState([]);
    const cerrarModalImagen = () => {
        setModalImagenVisible(false);
    };
    const abrirModalImagenSeleccionada = (imagen) => {
        setImagenSeleccionada(imagen);
        setModalImagenVisible(true);
    };


    useEffect(() => {
        cargarProductos();

    }, []);

    useEffect(() => {
        // Actualiza el valor del select cuando cambia el estado nuevoEstado
        setNuevoTitulo(producto.titulo);
        setNuevaDescripcion(producto.descripcion);
        setNuevoPrecio(producto.precio);
        setNuevoMasVendido(producto.masVendido)
        setNuevaCategoria(producto.categoria)
        setItem1(producto.item1);
        setItem2(producto.item2);
        setItem3(producto.item3);
        setItem4(producto.item4);
        setItem5(producto.item5);
        setItem6(producto.item6);
        setItem7(producto.item7);
        setItem8(producto.item8);
        setItem9(producto.item9);
        setItem10(producto.item10);
        setNuevoPrecioAnterior(producto.precioAnterior)
        setNuevoStock(producto.stock)
        setNuevaSubCategoria(producto.subcategoria);
    }, [producto]);

    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos || []);
                console.log(data.productos)
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };

    const eliminarProducto = (idProducto) => {
        // Reemplaza el window.confirm con SweetAlert2
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${baseURL}/productDelete.php?idProducto=${idProducto}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarProductos();
                    })
                    .catch(error => {
                        console.error('Error al eliminar la Producto:', error);
                        toast.error(error);
                    });
            }
        });
    };

    const abrirModal = (item) => {
        setProducto(item);
        setNuevoTitulo(item.titulo);
        setNuevaDescripcion(item.descripcion);
        setNuevoPrecio(item.precio);
        setNuevaCategoria(producto.categoria);
        setNuevaSubCategoria(producto.subcategoria);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
    };

    const productosFiltrados = productos.filter(item => {
        const idMatch = item.idProducto.toString().includes(filtroId);
        const tituloMatch = !filtroTitulo || item.titulo.includes(filtroTitulo);
        const categoriaMatch = !filtroCategoria || item.categoria.includes(filtroCategoria);
        const masVendidoMatch = !filtroMasVendido || item.masVendido.includes(filtroMasVendido);
        const categoriasMatch = !filtroCategoria2 || item.categoria.includes(filtroCategoria2);
        const subcategoriasMatch = !filtroSubCategoria || item.subcategoria.includes(filtroSubCategoria);
        return idMatch && tituloMatch && categoriaMatch && masVendidoMatch && categoriasMatch && subcategoriasMatch;
    });

    const descargarExcel = () => {
        const data = productosFiltrados.map(item => ({
            IdProducto: item.idProducto,
            Titulo: item.titulo,
            Descripcion: item.descripcion,
            Precio: item.precio,
            Fecha: item.createdAt,
            MasVendido: item.masVendido,
            Imagen1: item.imagen1,
            Imagen2: item.imagen2,
            Imagen3: item.imagen3,
            Imagen4: item.imagen4,

        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Productos');
        XLSX.writeFile(wb, 'productos.xlsx');
    };

    const descargarPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Lista de Productos', 10, 10);

        const columns = [
            { title: 'IdProducto', dataKey: 'idProducto' },
            { title: 'Titulo', dataKey: 'titulo' },
            { title: 'Descripcion', dataKey: 'descripcion' },
            { title: 'Precio', dataKey: 'precio' },
            { title: 'MasVendido', dataKey: 'masVendido' },
            { title: 'Fecha', dataKey: 'createdAt' },
        ];

        const data = productosFiltrados.map(item => ({
            IdProducto: item.idProducto,
            Titulo: item.titulo,
            Descripcion: item.descripcion,
            Precio: item.precio,
            MasVendido: item.masVendido,
            Fecha: item.createdAt,

        }));

        pdf.autoTable({
            head: [columns.map(col => col.title)],
            body: data.map(item => Object.values(item)),
        });

        pdf.save('productos.pdf');
    };

    const recargarProductos = () => {
        cargarProductos();
    };
    const invertirOrden = () => {
        setProductos([...productos].reverse());
        setOrdenInvertido(!ordenInvertido);
    };


    const handleUpdateText = (idProducto) => {
        const payload = {

            nuevoTitulo: nuevoTitulo !== '' ? nuevoTitulo : producto.titulo,
            nuevaDescripcion: nuevaDescripcion !== '' ? nuevaDescripcion : producto.descripcion,
            nuevoPrecio: nuevoPrecio !== '' ? nuevoPrecio : producto.precio,
            nuevaCategoria: nuevaCategoria !== '' ? nuevaCategoria : producto.categoria,
            masVendido: nuevoMasVendido !== '' ? nuevoMasVendido : producto.masVendido,
            item1: item1 !== undefined ? item1 : producto.item1,
            item2: item2 !== undefined ? item2 : producto.item2,
            item3: item3 !== undefined ? item3 : producto.item3,
            item4: item4 !== undefined ? item4 : producto.item4,
            item5: item5 !== undefined ? item5 : producto.item5,
            item6: item6 !== undefined ? item6 : producto.item6,
            item7: item7 !== undefined ? item7 : producto.item7,
            item8: item8 !== undefined ? item8 : producto.item8,
            item9: item9 !== undefined ? item9 : producto.item9,
            item10: item10 !== undefined ? item10 : producto.item10,
            precioAnterior: nuevoPrecioAnterior !== 0 ? nuevoPrecioAnterior : producto.precioAnterior,
            stock: nuevoStock !== '' ? nuevoStock : producto.stock,
            nuevaSubCategoria: nuevaSubCategoria !== '' ? nuevaSubCategoria : producto.subcategoria,
        };

        fetch(`${baseURL}/productoTextPut.php?idProducto=${idProducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {

                    Swal.fire(
                        'Error!',
                        data.error,
                        'error'
                    );
                } else {

                    Swal.fire(
                        'Editado!',
                        data.mensaje,
                        'success'
                    );
                    cargarProductos();
                    cerrarModal()
                }
            })
            .catch(error => {
                console.log(error.message);
                toast.error(error.message);
            });
    };

    const handleFileChange = (event, setFile, setPreview) => {
        const file = event.target.files[0];

        if (file) {
            // Crear una URL de objeto para la imagen seleccionada
            const previewURL = URL.createObjectURL(file);
            setFile(file);
            setPreview(previewURL);
        }
    };
    const handleEditarImagenBanner = (idProducto) => {
        const formData = new FormData();
        formData.append('idProducto', idProducto);
        formData.append('updateAction', 'update'); // Campo adicional para indicar que es una actualización

        if (nuevaImagen) {
            formData.append('imagen1', nuevaImagen);
        }
        if (nuevaImagen2) {
            formData.append('imagen2', nuevaImagen2);
        }
        if (nuevaImagen3) {
            formData.append('imagen3', nuevaImagen3);
        }
        if (nuevaImagen4) {
            formData.append('imagen4', nuevaImagen4);
        }

        fetch(`${baseURL}/productoImagePut.php`, {
            method: 'POST',  // Cambiado a POST
            body: formData
        })
            .then(response => {
                // Manejar el caso cuando la respuesta no es un JSON válido o está vacía
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa');

                }

                return response.json();
            })
            .then(data => {
                if (data.error) {

                    toast.error(data.error);
                    console.log(formData)
                } else {

                    toast.success(data.mensaje);
                    window.location.reload();
                }
            })
            .catch(error => {
                console.log(error)
                toast.error(error.message);
                console.log(formData)
                console.log(idProducto)
            });
    };

    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    useEffect(() => {
        cargarCategoria();
        cargarSubCategoria()
    }, []);


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
    const cargarSubCategoria = () => {
        fetch(`${baseURL}/subCategoriaGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setSubCategorias(data.subcategorias || []);
                console.log(data.subcategorias)
            })
            .catch(error => console.error('Error al cargar subcategorias:', error));
    };
    return (
        <div>

            <ToastContainer />
            <div className='deFlexContent'>

                <div className='deFlex2'>
                    <NewProduct />
                    <button className='excel' onClick={descargarExcel}><FontAwesomeIcon icon={faArrowDown} /> Excel</button>
                    <button className='pdf' onClick={descargarPDF}><FontAwesomeIcon icon={faArrowDown} /> PDF</button>
                </div>
                <div className='filtrosContain'>
                    <div className='inputsColumn'>
                        <input type="number" value={filtroId} onChange={(e) => setFiltroId(e.target.value)} placeholder='Id Producto' />
                    </div>

                    <div className='inputsColumn'>
                        <input type="text" value={filtroTitulo} onChange={(e) => setFiltroTitulo(e.target.value)} placeholder='Titulo' />
                    </div>
                    <div className='inputsColumn'>
                        <input type="text" value={filtroCategoria2} onChange={(e) => setFiltroCategoria2(e.target.value)} placeholder='Categoria' />
                    </div>
                    <div className='inputsColumn'>
                        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                            <option value="">Categorias</option>
                            {
                                categorias.map(item => (
                                    <option value={item?.categoria}>{item?.categoria}</option>
                                ))
                            }

                        </select>
                    </div>
                    <div className='inputsColumn'>
                        <select value={filtroSubCategoria} onChange={(e) => setFiltroSubCategoria(e.target.value)}>
                            <option value="">Subcategorias</option>
                            {
                                subcategorias.map(item => (
                                    <option value={item?.subcategoria}>{item?.subcategoria}</option>
                                ))
                            }

                        </select>
                    </div>
                    <div className='inputsColumn'>
                        <select value={filtroMasVendido} onChange={(e) => setFiltroMasVendido(e.target.value)}>
                            <option value="">Más vendidos</option>
                            <option value="si">Si</option>
                            <option value="no">No</option>

                        </select>
                    </div>

                    <button className='reload' onClick={recargarProductos}><FontAwesomeIcon icon={faSync} /></button>
                    <button className='reverse' onClick={invertirOrden}>
                        {ordenInvertido ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}
                    </button>

                </div>

            </div>


            {modalImagenVisible && (
                <div className="modalImg">
                    <div className="modal-contentImg">


                        <span className="close2" onClick={cerrarModalImagen}>
                            &times;
                        </span>

                        <img src={imagenSeleccionada} alt="Imagen Seleccionada" />
                    </div>
                </div>
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <div className='deFlexBtnsModal'>

                            <div className='deFlexBtnsModal'>
                                <button
                                    className={selectedSection === 'texto' ? 'selected' : ''}
                                    onClick={() => handleSectionChange('texto')}
                                >
                                    Editar Texto
                                </button>
                                <button
                                    className={selectedSection === 'imagenes' ? 'selected' : ''}
                                    onClick={() => handleSectionChange('imagenes')}
                                >
                                    Editar Imagenes
                                </button>
                            </div>
                            <span className="close" onClick={cerrarModal}>
                                &times;
                            </span>
                        </div>
                        <div className='sectiontext' style={{ display: selectedSection === 'texto' ? 'flex' : 'none' }}>
                            <div className='flexGrap'>
                                <fieldset>
                                    <legend>Titulo</legend>
                                    <input
                                        type="text"
                                        value={nuevoTitulo !== '' ? nuevoTitulo : producto.titulo}
                                        onChange={(e) => setNuevoTitulo(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Precio</legend>
                                    <input
                                        type="number"
                                        value={nuevoPrecio !== '' ? nuevoPrecio : producto.precio}
                                        onChange={(e) => setNuevoPrecio(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset id='descripcion'>
                                    <legend>Descripcion</legend>
                                    <textarea
                                        type="text"
                                        value={nuevaDescripcion !== '' ? nuevaDescripcion : producto.descripcion}
                                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Categoria</legend>
                                    <select
                                        value={nuevaCategoria !== '' ? nuevaCategoria : producto.categoria}
                                        onChange={(e) => setNuevaCategoria(e.target.value)}
                                    >
                                        <option value={producto.categoria}>{producto.categoria}</option>
                                        {
                                            categorias.map(item => (
                                                <option value={item?.categoria}>{item?.categoria}</option>
                                            ))
                                        }
                                    </select>
                                </fieldset>
                                <fieldset>
                                    <legend>Subcategoria</legend>
                                    <select
                                        value={nuevaSubCategoria !== '' ? nuevaSubCategoria : producto.subcategoria}
                                        onChange={(e) => setNuevaSubCategoria(e.target.value)}
                                    >
                                        <option value={producto.subcategoria}>{producto.subcategoria}</option>
                                        {
                                            subcategorias.map(item => (
                                                <option value={item?.subcategoria}>{item?.subcategoria}</option>
                                            ))
                                        }
                                    </select>
                                </fieldset>
                                <fieldset>
                                    <legend>Más vendido</legend>
                                    <select
                                        value={nuevoMasVendido !== '' ? nuevoMasVendido : producto.masVendido}
                                        onChange={(e) => setNuevoMasVendido(e.target.value)}
                                    >
                                        <option value={producto.masVendido}>{producto.masVendido}</option>
                                        <option value="si">Si</option>
                                        <option value="no">No</option>
                                    </select>
                                </fieldset>
                                <fieldset>
                                    <legend>Stock</legend>

                                    <input
                                        type="number"
                                        value={nuevoStock !== '' ? nuevoStock : producto.stock}
                                        onChange={(e) => setNuevoStock(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Precio anterior</legend>
                                    <input
                                        type="number"
                                        value={nuevoPrecioAnterior !== '' ? nuevoPrecioAnterior : producto.precioAnterior}
                                        onChange={(e) => setNuevoPrecioAnterior(e.target.value)}
                                    />
                                </fieldset>
                                <div className='items'>
                                    <fieldset>
                                        <legend>Item 1</legend>
                                        <input
                                            type="text"
                                            id="item1"
                                            name="item1"
                                            required
                                            value={item1}
                                            onChange={(e) => setItem1(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 2</legend>
                                        <input
                                            type="text"
                                            id="item2"
                                            name="item2"
                                            required
                                            value={item2}
                                            onChange={(e) => setItem2(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 3</legend>
                                        <input
                                            type="text"
                                            id="item3"
                                            name="item3"
                                            required
                                            value={item3}
                                            onChange={(e) => setItem3(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 4</legend>
                                        <input
                                            type="text"
                                            id="item4"
                                            name="item4"
                                            required
                                            value={item4}
                                            onChange={(e) => setItem4(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 5</legend>
                                        <input
                                            type="text"
                                            id="item5"
                                            name="item5"
                                            required
                                            value={item5}
                                            onChange={(e) => setItem5(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 6</legend>
                                        <input
                                            type="text"
                                            id="item6"
                                            name="item6"
                                            required
                                            value={item6}
                                            onChange={(e) => setItem6(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 7</legend>
                                        <input
                                            type="text"
                                            id="item7"
                                            name="item7"
                                            required
                                            value={item7}
                                            onChange={(e) => setItem7(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 8</legend>
                                        <input
                                            type="text"
                                            id="item8"
                                            name="item8"
                                            required
                                            value={item8}
                                            onChange={(e) => setItem8(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 9</legend>
                                        <input
                                            type="text"
                                            id="item9"
                                            name="item9"
                                            required
                                            value={item9}
                                            onChange={(e) => setItem9(e.target.value)}
                                        />
                                    </fieldset>

                                    <fieldset>
                                        <legend>Item 10</legend>
                                        <input
                                            type="text"
                                            id="item10"
                                            name="item10"
                                            required
                                            value={item10}
                                            onChange={(e) => setItem10(e.target.value)}
                                        />
                                    </fieldset>


                                </div>
                            </div>




                            <button className='btnPost' onClick={() => handleUpdateText(producto.idProducto)} >Guardar </button>

                        </div>

                        <div className='sectionImg' style={{ display: selectedSection === 'imagenes' ? 'flex' : 'none' }}>
                            <div className='previevProduct'>

                                {imagenPreview ? (
                                    <img src={imagenPreview} alt="Vista previa de la imagen" onClick={() => abrirModalImagenSeleccionada(producto.imagen1)} />
                                ) : (
                                    <>
                                        {producto.imagen1 ? (
                                            <img src={producto.imagen1} alt="imagen" onClick={() => abrirModalImagenSeleccionada(producto.imagen1)} />

                                        ) : (
                                            <span className='imgNone'>
                                                No hay imagen

                                            </span>
                                        )}
                                    </>
                                )}

                                {imagenPreview2 ? (
                                    <img src={imagenPreview2} alt="Vista previa de la imagen" />
                                ) : (
                                    <>
                                        {producto.imagen2 ? (
                                            <img src={producto.imagen2} alt="imagen" onClick={() => abrirModalImagenSeleccionada(producto.imagen2)} />

                                        ) : (
                                            <span className='imgNone'>
                                                No hay imagen

                                            </span>
                                        )}
                                    </>
                                )}
                                {imagenPreview3 ? (
                                    <img src={imagenPreview3} alt="Vista previa de la imagen" />
                                ) : (
                                    <>
                                        {producto.imagen3 ? (
                                            <img src={producto.imagen3} alt="imagen" onClick={() => abrirModalImagenSeleccionada(producto.imagen3)} />

                                        ) : (
                                            <span className='imgNone'>
                                                No hay imagen

                                            </span>
                                        )}
                                    </>
                                )}
                                {imagenPreview4 ? (
                                    <img src={imagenPreview4} alt="Vista previa de la imagen" />
                                ) : (
                                    <>
                                        {producto.imagen4 ? (
                                            <img src={producto.imagen4} alt="imagen" onClick={() => abrirModalImagenSeleccionada(producto.imagen4)} />

                                        ) : (
                                            <span className='imgNone'>
                                                No hay imagen

                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <fieldset>
                                <legend>Editar Imagen1 </legend>
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen, setImagenPreview)} />
                            </fieldset>
                            <fieldset>
                                <legend>Editar Imagen2 </legend>
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen2, setImagenPreview2)} />
                            </fieldset>
                            <fieldset>
                                <legend>Editar Imagen3 </legend>
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen3, setImagenPreview3)} />
                            </fieldset>
                            <fieldset>
                                <legend>Editar Imagen4 </legend>
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen4, setImagenPreview4)} />
                            </fieldset>


                            <button className='btnPost' onClick={() => handleEditarImagenBanner(producto.idProducto)}>Guardar </button>

                        </div>



                    </div>
                </div>
            )}
            <div className='table-container'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id Producto</th>
                            <th>Titulo</th>
                            <th>Descripcion</th>
                            <th>Precio</th>
                            <th>Categoria</th>
                            <th>Más vendido</th>
                            <th>Imagen</th>
                            <th>Imagen 2</th>
                            <th>Imagen 3</th>
                            <th>Imagen 4</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map(item => (
                            <tr key={item.idProducto}>
                                <td>{item.idProducto}</td>
                                <td>{item.titulo}</td>
                                <td>{item.descripcion}</td>

                                <td style={{
                                    color: '#008000',
                                }}>
                                    ${`${item?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </td>

                                <td style={{
                                    color: '#DAA520',

                                }}>  {`${item?.categoria}`}</td>
                                <td>{item.masVendido}</td>
                                <td>
                                    {item.imagen1 ? (
                                        <img src={item.imagen1} alt="imagen1" />
                                    ) : (
                                        <span className='imgNonetd'>
                                            Sin imagen
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {item.imagen2 ? (
                                        <img src={item.imagen2} alt="imagen2" />
                                    ) : (
                                        <span className='imgNonetd'>
                                            Sin imagen
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {item.imagen3 ? (
                                        <img src={item.imagen3} alt="imagen3" />
                                    ) : (
                                        <span className='imgNonetd'>
                                            Sin imagen
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {item.imagen4 ? (
                                        <img src={item.imagen4} alt="imagen4" />
                                    ) : (
                                        <span className='imgNonetd'>
                                            Sin imagen
                                        </span>
                                    )}
                                </td>

                                <td>

                                    <button className='eliminar' onClick={() => eliminarProducto(item.idProducto)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button className='editar' onClick={() => abrirModal(item)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};
