import React, { useState, useEffect } from 'react';
import Spiner from '../Components/Admin/Spiner/Spiner';
import { Outlet } from 'react-router-dom';
import Auth from '../Components/Admin/Auth/Auth';
import baseURL from '../Components/url';
export default function MainLayout() {
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseURL}/userLogued.php`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsuario(data);
                setLoading(false);

            } catch (error) {
                console.error('Error al obtener datos:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div>


                {loading ? (
                    <Spiner />
                ) : usuario.idUsuario ? (
                    <>
                        <Outlet />
                    </>
                ) : (
                    <Auth />
                )}
            </div>

        </div>
    );
}
