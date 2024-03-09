import React, { useState } from 'react';
import './NewContact.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';

export default function NewContact() {
    const [mensaje, setMensaje] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [instagram, setInstagram] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => {
        setTelefono('');
        setInstagram('');
        setEmail('');
        setDireccion('');
        setLocalidad('');
        setMensaje('');
        setModalOpen(!modalOpen);
    };

    const crear = async () => {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('telefono', telefono);
        formData.append('instagram', instagram);
        formData.append('email', email);
        formData.append('direccion', direccion);
        formData.append('localidad', localidad);

        setMensaje('Procesando...');

        try {
            const response = await fetch(`${baseURL}/contactoPost.php`, {
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
                            <h4>Agregar nuevo Contacto</h4>
                            <span className='close' onClick={toggleModal}>
                                &times;
                            </span>
                        </div>
                        <form>
                            <fieldset>
                                <legend>Nombre</legend>
                                <input
                                    type='text'
                                    name='nombre'
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Telefono</legend>
                                <input
                                    type='text'
                                    name='telefono'
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Instagram</legend>
                                <input
                                    type='url'
                                    name='instagram'
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Email</legend>
                                <input
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Dirección</legend>
                                <input
                                    type='text'
                                    name='direccion'
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Localidad</legend>
                                <input
                                    type='text'
                                    name='localidad'
                                    value={localidad}
                                    onChange={(e) => setLocalidad(e.target.value)}
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
