import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';
import NewCodigo from '../NewCodigo/NewCodigo';

export default function CodigosData() {
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

    const eliminarCodigo = (idCodigo) => {
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
                fetch(`${baseURL}/codigosDelete.php?idCodigo=${idCodigo}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarCodigos();
                    })
                    .catch(error => {
                        console.error('Error al eliminar código:', error);
                        toast.error(error);
                    });
            }
        });
    };




    return (
        <div>
            <ToastContainer />
            <NewCodigo />


            <div className='table-container'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id Código</th>
                            <th>Código</th>
                            <th>Descuento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codigos.map(item => (
                            <tr key={item.idCodigo}>
                                <td>{item.idCodigo}</td>
                                <td>{item.codigo}</td>
                                <td style={{ color: 'green' }}>${item.descuento?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                <td>
                                    <button className='eliminar' onClick={() => eliminarCodigo(item.idCodigo)}>
                                        <FontAwesomeIcon icon={faTrash} />
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
