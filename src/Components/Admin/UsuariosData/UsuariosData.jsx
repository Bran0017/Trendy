import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowUp, faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import baseURL from '../../url';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Register from '../Register/Register';
export default function UsuariosData() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtroIdUsuario, setFiltroIdUsuario] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [ordenInvertido, setOrdenInvertido] = useState(false);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        fetch(`${baseURL}/usuariosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setUsuarios(data.usuarios || []);
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    };

    const eliminarUsuario = (idUsuario) => {
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
                fetch(`${baseURL}/usuariosGet.php?idUsuario=${idUsuario}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarUsuarios();
                    })
                    .catch(error => {
                        console.error('Error al eliminar usuario:', error)
                        toast.success(error);
                    });
            }
        });
    };

    const editarUsuario = (idUsuario, rolActual) => {
        Swal.fire({
            title: 'Editar Rol',
            input: 'select',
            inputOptions: {
                'usuario': 'Usuario',
                'admin': 'Admin'
            },
            inputValue: rolActual,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevoRol = result.value;
                fetch(`${baseURL}/usuariosGet.php?idUsuario=${idUsuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rol: nuevoRol }),
                })
                    .then(response => response.json())
                    .then(data => {
                        toast.success(data.mensaje);
                        cargarUsuarios();
                    })
                    .catch(error => {
                        console.error('Error al editar el rol del usuario:', error)
                        toast.success(error);
                    });
            }
        });
    };

    const usuariosFiltrados = usuarios.filter(usuario => {
        const idUsuarioMatch = usuario.idUsuario.toString().includes(filtroIdUsuario);
        const nombreMatch = usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const rolMatch = !filtroRol || usuario.rol.includes(filtroRol);
        const fechaDesdeMatch = !filtroFechaDesde || new Date(usuario.createdAt) >= new Date(filtroFechaDesde);
        const fechaHastaMatch = !filtroFechaHasta || new Date(usuario.createdAt) <= new Date(filtroFechaHasta);
        const emailMatch = usuario.email.toLowerCase().includes(filtroEmail.toLowerCase());

        return idUsuarioMatch && nombreMatch && rolMatch && fechaDesdeMatch && fechaHastaMatch && emailMatch;
    });

    const descargarExcel = () => {
        const data = usuariosFiltrados.map(usuarios => ({

            'ID Usuario': usuarios.idUsuario,
            Nombre: usuarios.nombre,
            Email: usuarios.email,
            Fecha: usuarios.createdAt,

        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
        XLSX.writeFile(wb, 'usuarios.xlsx');
    };

    const descargarPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Lista de Usuarios', 10, 10);

        const columns = [

            { title: 'ID Usuario', dataKey: 'idUsuario' },
            { title: 'Nombre', dataKey: 'nombre' },
            { title: 'Email', dataKey: 'email' },
            { title: 'Fecha', dataKey: 'createdAt' },
        ];

        const data = usuariosFiltrados.map(usuarios => ({

            idUsuario: usuarios.idUsuario,
            nombre: usuarios.nombre,
            email: usuarios.email,
            createdAt: usuarios.createdAt,
        }));

        pdf.autoTable({
            head: [columns.map(col => col.title)],
            body: data.map(item => Object.values(item)),
        });

        pdf.save('usuarios.pdf');
    };
    const recargarUsuarios = () => {
        cargarUsuarios();
    };
    const invertirOrden = () => {
        setUsuarios([...usuarios].reverse());
        setOrdenInvertido(!ordenInvertido);
    };
    return (
        <div>
            <div className='deFlexContent'>
                <div className='deFlex2'>
                    <Register />
                    <button className='excel' onClick={descargarExcel}><FontAwesomeIcon icon={faArrowDown} /> Excel</button>
                    <button className='pdf' onClick={descargarPDF}><FontAwesomeIcon icon={faArrowDown} /> PDF</button>

                </div>


                <div className='filtrosContain'>
                    <div className='inputsColumn'>

                        <input type="number" value={filtroIdUsuario} onChange={(e) => setFiltroIdUsuario(e.target.value)} placeholder='ID Usuario' />
                    </div>

                    <div className='inputsColumn'>

                        <input type="text" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} placeholder='Nombre' />
                    </div>
                    <div className='inputsColumn'>

                        <input type="text" value={filtroEmail} onChange={(e) => setFiltroEmail(e.target.value)} placeholder='Email' />
                    </div>
                    <div className='inputsColumn'>

                        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button className='reload' onClick={recargarUsuarios}><FontAwesomeIcon icon={faSync} /></button>
                    <button className='reverse' onClick={invertirOrden}>
                        {ordenInvertido ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}
                    </button>


                </div>
            </div>


            <div className='table-container'>
                <ToastContainer />

                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID Usuario</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map(usuario => (
                            <tr key={usuario.idUsuario}>
                                <td>{usuario.idUsuario}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td style={{
                                    color: usuario?.rol === 'usuario' ? '#DAA520' : usuario?.rol === 'admin' ? '#008000' : '#FF0000',

                                }}>  {`${usuario?.rol}`}</td>
                                <td>{usuario.createdAt}</td>
                                <td>

                                    <button className='eliminar' onClick={() => eliminarUsuario(usuario.idUsuario)}><FontAwesomeIcon icon={faTrash} /></button>

                                    <button className='editar' onClick={() => editarUsuario(usuario.idUsuario, usuario.rol)}><FontAwesomeIcon icon={faEdit} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};
