import React, { useState, useEffect } from 'react';
import './InfoUserMain.css';
import baseURL from '../../url';
import { Link as Anchor } from 'react-router-dom';

export default function InfoUserMain() {
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseURL}/userLogued.php`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsuario(data);
                setLoading(false);
                console.log(data)
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            {loading ? (
                <div>cargando</div>
            ) : usuario.idUsuario ? (
                <Anchor to={``} className='infoUser'>
                    <span className='iconName'> {usuario.nombre.slice(0, 1)}</span>
                    <span className='name'>   {usuario.nombre}</span>
                    <span className='email'>  {usuario.email} </span>
                    <span className='rol'>   {usuario.rol}</span>


                </Anchor>
            ) : (
                <Anchor to={``} className='infoUser'>

                    <span className='iconName'> </span>
                    <span className='name'> </span>
                    <span className='email'> </span>
                    <span className='rol'> </span>
                </Anchor>
            )}
        </div>
    );
}
