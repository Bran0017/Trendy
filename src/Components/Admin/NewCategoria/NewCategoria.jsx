import React, { useState } from 'react';
import './NewCategoria.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';

export default function NewCategoria() {
    const [mensaje, setMensaje] = useState('');
    const [categoria, setCategoria] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setCategoria('');
        setMensaje('');
        setModalOpen(!modalOpen);
    };


    const crear = async () => {
        const formData = new FormData();
        formData.append('categoria', categoria);

        setMensaje('Procesando...');

        try {
            const response = await fetch(`${baseURL}/categoriasPost.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.mensaje) {
                setMensaje('');
                toast.success(data.mensaje);
                toggleModal();
                window.location.reload();
            } else if (data.error) {
                setMensaje('');
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje('');
            toast.error('Error de conexión. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <div className='NewContain'>
            <ToastContainer />
            <button onClick={toggleModal} className='btnSave'>
                <span>+</span> Agregar
            </button>
            {modalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <div className='deFlexBack'>
                            <h4>Agregar Categoría</h4>
                            <span className='close' onClick={toggleModal}>
                                &times;
                            </span>
                        </div>
                        <form id="crearForm">
                            <fieldset>
                                <legend>Categoría</legend>
                                <input
                                    type='text'
                                    name='categoria'
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                />
                            </fieldset>
                            {mensaje ? (
                                <button type='button' className='btnLoading' disabled>
                                    {mensaje}
                                </button>
                            ) : (
                                <button type='button' onClick={crear} className='btnSave'>
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
