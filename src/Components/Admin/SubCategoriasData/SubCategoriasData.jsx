import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowUp, faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import baseURL from '../../url';
import NewSubCategoria from '../NewSubCategoria/NewSubCategoria';
export default function SubCategoriasData() {
    const [subcategorias, setSubCategorias] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevaSubCategoria, setNuevaSubCategoria] = useState('');
    const [subcategoria, setSubCategoria] = useState({});
    const [selectedSection, setSelectedSection] = useState('texto');

    useEffect(() => {
        cargarSubCategoria();

    }, []);


    const cargarSubCategoria = () => {
        fetch(`${baseURL}/subCategoriaGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setSubCategorias(data.subcategorias || []);
                console.log(data.subcategorias)
            })
            .catch(error => console.error('Error al cargar contactos:', error));
    };

    const deleted = (idSubCategoria) => {
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
                fetch(`${baseURL}/subCategoriaDelete.php?idSubCategoria=${idSubCategoria}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarSubCategoria();
                    })
                    .catch(error => {
                        console.error('Error al eliminar contacto:', error);
                        toast.error(error);
                    });
            }
        });
    };

    const abrirModal = (item) => {
        setSubCategoria(item);
        setNuevaSubCategoria(item.subcategoria);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
    };



    const handleUpdateText = (idSubCategoria) => {
        const payload = {
            subcategoria: nuevaSubCategoria !== '' ? nuevaSubCategoria : subcategoria.subcategoria,

        };

        fetch(`${baseURL}/subCategoriaPut.php?idSubCategoria=${idSubCategoria}`, {
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
                    console.log(nuevaSubCategoria)
                } else {
                    Swal.fire(
                        'Editado!',
                        data.mensaje,
                        'success'
                    );
                    cargarSubCategoria();
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
            <NewSubCategoria />

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
                                    <legend>SubCategoria</legend>
                                    <input
                                        type="text"
                                        value={nuevaSubCategoria !== '' ? nuevaSubCategoria : subcategoria.subcategoria}
                                        onChange={(e) => setNuevaSubCategoria(e.target.value)}
                                    />
                                </fieldset>

                            </div>

                            <button className='btnPost' onClick={() => handleUpdateText(subcategoria.idSubCategoria)} >Guardar</button>

                        </div>

                    </div>
                </div>
            )}
            <div className='table-container'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id SubCategoria</th>
                            <th>Sub Categoria</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategorias.map(item => (
                            <tr key={item.idSubCategoria}>
                                <td>{item.idSubCategoria}</td>
                                <td>{item.subcategoria}</td>
                                <td>

                                    <button className='eliminar' onClick={() => deleted(item.idSubCategoria)}>
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
