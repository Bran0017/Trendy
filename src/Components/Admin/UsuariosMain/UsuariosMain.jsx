import React, { useEffect, useState } from 'react';
import './UsuariosMain.css'
import { Link as Anchor } from "react-router-dom";
import baseURL from '../../url';
export default function UsuariosData() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        fetch(`${baseURL}/usuariosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setUsuarios(data.usuarios.reverse().slice(0, 5) || []);
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    };




    return (



        <div className='table-containerUsuarios'>
            <div className='deFlexMore'>
                <h3>Ultimos {usuarios?.length} registros</h3>
                <Anchor to={`/dashboard/usuarios`} className='logo'>
                    Ver más
                </Anchor>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th>ID Usuario</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Fecha</th>

                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.idUsuario}>
                            <td>{usuario.idUsuario}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.email}</td>

                            <td style={{
                                color: usuario?.rol === 'usuario' ? '#DAA520' : usuario?.rol === 'admin' ? 'green' : 'red',
                            }}>  {`${usuario?.rol}`}</td>

                            <td>{usuario.createdAt}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>

    );
};
