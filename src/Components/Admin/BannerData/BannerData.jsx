import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faArrowUp, faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import baseURL from '../../url';
import './BannerData.css'
import NewBanner from '../NewBanner/NewBanner';
export default function BannerData() {
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        cargarBanners();

    }, []);
    const cargarBanners = () => {
        fetch(`${baseURL}/bannersGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setBanners(data.banner || []);
                console.log(data.banner)
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };
    const eliminarBanner = (idBanner) => {
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
                fetch(`${baseURL}/bannerDelete.php?idBanner=${idBanner}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarBanners();
                    })
                    .catch(error => {
                        console.error('Error al eliminar la Producto:', error);
                        toast.error(error);
                    });
            }
        });
    };
    return (
        <div className='BannerContainer'>
            <NewBanner />
            <div className='BannerWrap'>
                {
                    banners.map(item => (
                        <div className='cardBanner'>
                            <img src={item.imagen} alt="banner" />
                            <button className='btnBannerDelete' onClick={() => eliminarBanner(item.idBanner)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))
                }

            </div>

        </div>
    )
}
