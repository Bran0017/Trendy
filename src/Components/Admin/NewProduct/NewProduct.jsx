import React, { useState, useEffect } from 'react';
import './NewProduct.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';
export default function NewProduct() {
    const [mensaje, setMensaje] = useState('');
    const [imagenPreview1, setImagenPreview1] = useState(null);
    const [imagenPreview2, setImagenPreview2] = useState(null);
    const [imagenPreview3, setImagenPreview3] = useState(null);
    const [imagenPreview4, setImagenPreview4] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [titulo, setTitulo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [masVendido, setMasVendido] = useState('');
    const [precio, setPrecio] = useState('');
    const [isImage1Selected, setIsImage1Selected] = useState(false);
    const [isImage2Selected, setIsImage2Selected] = useState(false);
    const [isImage3Selected, setIsImage3Selected] = useState(false);
    const [isImage4Selected, setIsImage4Selected] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
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
    const [precioAnterior, setPrecioAnterior] = useState('');
    const [stock, setStock] = useState('');
    const [subcategorias, setSubCategorias] = useState([]);
    const [subcategoria, setSubCategoria] = useState([]);
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    const handleImagenChange = (event, setImagenPreview, setIsImageSelected) => {
        const file = event.target.files[0];

        if (file) {

            const previewURL = URL.createObjectURL(file);
            setImagenPreview(previewURL);
            setIsImageSelected(true);
        }
    };


    const crear = async () => {
        const form = document.getElementById("crearForm");
        const formData = new FormData(form);
        const resetForm = () => {
            form.reset();
            setImagenPreview1(null);
            setImagenPreview2(null);

            setIsImage1Selected(false);
            setIsImage2Selected(false);
        };
        setMensaje('');

        if (
            !formData.get('descripcion') ||
            !formData.get('titulo') ||
            !formData.get('categoria') ||
            !formData.get('masVendido') ||
            !formData.get('precio') ||
            !formData.get('imagen1') ||
            !formData.get('imagen2') ||
            !formData.get('imagen3') ||
            !formData.get('imagen4')
        ) {
            toast.error('Por favor, complete todos los campos correctamente.');
            return;
        }

        setMensaje('Procesando...');

        try {
            const response = await fetch(`${baseURL}/productosPost.php`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.mensaje) {
                setMensaje('');
                resetForm();
                toast.success(data.mensaje);
                window.location.reload();
            } else if (data.error) {
                setMensaje('');
                toast.error(data.error);
                console.log(data.error);

            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje('');
            toast.error('Error de conexión. Por favor, inténtelo de nuevo.');

        }
    };


    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);
    };
    const handleMasVendidoChange = (e) => {
        setMasVendido(e.target.value);
    };
    const handleStock = (e) => {
        setStock(e.target.value);
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
    const handleSubCategoriaChange = (e) => {
        setSubCategoria(e.target.value);
    };

    return (
        <div className='NewContain'>
            <ToastContainer />
            <button onClick={toggleModal} className='btnSave'>
                <span>  +</span> Agregar
            </button>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className='deFlexBack'>
                            <h4>Agregar Producto</h4>
                            <span className="close" onClick={toggleModal}>&times;</span>
                        </div>
                        <form id="crearForm">

                            <div className='flexGrap'>
                                <fieldset>
                                    <legend>Título</legend>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        required
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Precio</legend>
                                    <input
                                        type="number"
                                        id="precio"
                                        name="precio"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset id='descripcion'>
                                    <legend>Descripción</legend>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        required
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Descripción"
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Categoría</legend>
                                    <select
                                        id="categoria"
                                        name="categoria"
                                        value={categoria}
                                        onChange={handleCategoriaChange}
                                    >
                                        <option value="">Selecciona una categoría</option>
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
                                        id="subcategoria"
                                        name="subcategoria"
                                        value={subcategoria}
                                        onChange={handleSubCategoriaChange}
                                    >
                                        <option value="">Selecciona una subcategoria</option>
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
                                        id="masVendido"
                                        name="masVendido"
                                        value={masVendido}
                                        onChange={handleMasVendidoChange}
                                    >
                                        <option value="">Selecciona opcion</option>
                                        <option value="si">Si</option>
                                        <option value="no">No</option>

                                    </select>
                                </fieldset>
                                <fieldset>
                                    <legend>Stock</legend>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Precio anterior</legend>
                                    <input
                                        type="number"
                                        id="precioAnterior"
                                        name="precioAnterior"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={precioAnterior}
                                        onChange={(e) => setPrecioAnterior(e.target.value)}
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




                                <fieldset>
                                    <legend>Imagen1</legend>
                                    <input
                                        type="file"
                                        id="imagen1"
                                        name="imagen1"
                                        accept="image/*"
                                        onChange={(e) => handleImagenChange(e, setImagenPreview1, setIsImage1Selected)}
                                        required
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Imagen2</legend>
                                    <input
                                        type="file"
                                        id="imagen2"
                                        name="imagen2"
                                        accept="image/*"
                                        onChange={(e) => handleImagenChange(e, setImagenPreview2, setIsImage2Selected)}
                                        required
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Imagen3</legend>
                                    <input
                                        type="file"
                                        id="imagen3"
                                        name="imagen3"
                                        accept="image/*"
                                        onChange={(e) => handleImagenChange(e, setImagenPreview3, setIsImage3Selected)}
                                        required
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Imagen4</legend>

                                    <input
                                        type="file"
                                        id="imagen4"
                                        name="imagen4"
                                        accept="image/*"
                                        onChange={(e) => handleImagenChange(e, setImagenPreview4, setIsImage4Selected)}
                                        required
                                    />
                                </fieldset>

                            </div>
                            {(isImage1Selected || isImage2Selected || isImage3Selected || isImage4Selected) &&
                                <div className='previevCategori'>
                                    {isImage1Selected && <img src={imagenPreview1} alt="Vista previa 1" />}
                                    {isImage2Selected && <img src={imagenPreview2} alt="Vista previa 2" />}
                                    {isImage3Selected && <img src={imagenPreview3} alt="Vista previa 3" />}
                                    {isImage4Selected && <img src={imagenPreview4} alt="Vista previa 4" />}
                                </div>
                            }
                            {mensaje ? (
                                <button type="button" className='btnLoading' disabled>
                                    {mensaje}
                                </button>
                            ) : (
                                <button type="button" onClick={crear} className='btnPost'>
                                    Agregar
                                </button>
                            )}


                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

