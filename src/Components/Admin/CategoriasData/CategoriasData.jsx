import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowUp, faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import './CategoriasData.css'
import 'jspdf-autotable';
import baseURL from '../../url';
import NewCategoria from '../NewCategoria/NewCategoria';
export default function CategoriasData() {
    const [categorias, setCategoras] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [categoria, setCategoria] = useState({});
    const [selectedSection, setSelectedSection] = useState('texto');

    useEffect(() => {
        cargarCategoria();

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

    const eliminarCategoria = (idCategoria) => {
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
                fetch(`${baseURL}/categoriaDelete.php?idCategoria=${idCategoria}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarCategoria();
                    })
                    .catch(error => {
                        console.error('Error al eliminar contacto:', error);
                        toast.error(error);
                    });
            }
        });
    };

    const abrirModal = (item) => {
        setCategoria(item);
        setNuevaCategoria(item.categoria);

        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
    };



    const handleUpdateText = (idCategoria) => {
        const payload = {
            categoria: nuevaCategoria !== '' ? nuevaCategoria : categoria.categoria,

        };

        fetch(`${baseURL}/categoriaPut.php?idCategoria=${idCategoria}`, {
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
                    console.log(idCategoria)
                } else {
                    Swal.fire(
                        'Editado!',
                        data.mensaje,
                        'success'
                    );
                    cargarCategoria();
                    cerrarModal();
                }
            })
            .catch(error => {
                console.log(error.message);
                toast.error(error.message);
            });
    };



    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };
    return (
        <div>
            <ToastContainer />
            <NewCategoria />

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

                            </div>
                            <span className="close" onClick={cerrarModal}>
                                &times;
                            </span>
                        </div>
                        <div className='sectiontext' style={{ display: selectedSection === 'texto' ? 'flex' : 'none' }}>
                            <div className='flexGrap'>
                                <fieldset>
                                    <legend>Categoria</legend>
                                    <input
                                        type="text"
                                        value={nuevaCategoria !== '' ? nuevaCategoria : categoria.categoria}
                                        onChange={(e) => setNuevaCategoria(e.target.value)}
                                    />
                                </fieldset>

                            </div>

                            <button className='btnSave' onClick={() => handleUpdateText(categoria.idCategoria)} >Guardar cambios</button>

                        </div>

                    </div>
                </div>
            )}
            <div className='table-container'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id Categoria</th>
                            <th>Categoria</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map(item => (
                            <tr key={item.idCategoria}>
                                <td>{item.idCategoria}</td>
                                <td>{item.categoria}</td>
                                <td>

                                    <button className='eliminar' onClick={() => eliminarCategoria(item.idCategoria)}>
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
