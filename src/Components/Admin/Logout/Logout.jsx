import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import baseURL from '../../url';

import { Link as Anchor } from "react-router-dom";
export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${baseURL}/logout.php`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mensaje) {
                    console.log(data.mensaje);
                    toast.success(data.mensaje);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else if (data.error) {
                    console.log(data.error);
                    toast.error(data.error);
                }
            } else {
                throw new Error('Error en la solicitud al servidor');
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.message);
        }
    };

    return (
        <div>

            <Anchor onClick={handleLogout} className='btn'>
                <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }} />
                Salir
            </Anchor>
        </div>
    );
}
