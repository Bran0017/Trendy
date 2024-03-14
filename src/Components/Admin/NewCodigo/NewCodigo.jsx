import React, { useState } from 'react';
import './NewCodigo.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';

export default function NewCodigo() {
    const [mensaje, setMensaje] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [descuento, setDescuento] = useState(0);
    const [codigo, setCodigo] = useState('');
    const toggleModal = () => {
        setCodigo('');
        setMensaje('');
        setDescuento(0);
        setModalOpen(!modalOpen);
    };

    const generarCodigoAleatorio = () => {

        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigoAleatorio = '';
        for (let i = 0; i < 6; i++) {
            codigoAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigoAleatorio;
    };

    const crear = async () => {
        const codigoAleatorio = generarCodigoAleatorio();

        const formData = new FormData();
        formData.append('codigo', codigoAleatorio);
        formData.append('descuento', descuento);

        setMensaje('Procesando...');

        try {
            const response = await fetch(`${baseURL}/codigosPost.php`, {
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
                            <h4>Agregar Codigo</h4>
                            <span className='close' onClick={toggleModal}>
                                &times;
                            </span>
                        </div>
                        <form id="crearForm">
                            <fieldset>
                                <legend>Codigo</legend>
                                <input
                                    type='text'
                                    name='codigo'
                                    value={generarCodigoAleatorio()}
                                    readOnly
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Descuento</legend>
                                <input
                                    type='number'
                                    name='descuento'
                                    value={descuento}
                                    onChange={(e) => setDescuento(e.target.value)}
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
