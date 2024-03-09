import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';
import './Register.css'

export default function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState(''); // Estado para el rol
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensaje2, setMensaje2] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formularioEnviado, setFormularioEnviado] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const crearCatalogo = async (e) => {
        e.preventDefault();
        setMensaje2('Procesando...')
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('email', email);
            formData.append('rol', rol);
            formData.append('contrasena', contrasena);

            const response = await fetch(`${baseURL}/registroPost.php`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mensaje) {
                    setMensaje(data.mensaje);
                    toast.success(data.mensaje);
                    setMensaje2('')
                    setFormularioEnviado(false);
                    window.location.reload();

                } else if (data.error) {
                    setError(data.error);
                    toast.error(data.error);
                    setMensaje2('')

                }
            } else {
                throw new Error('Error en la solicitud al servidor');
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.message);
            setMensaje2('')
        }
    };

    return (
        <div >
            <ToastContainer />
            <button onClick={toggleModal} className='btnSave'>
                <span>  +</span>   Agregar
            </button>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className='deFlexBack'>
                            <h4>Agregar Usuario</h4>
                            <span className="close" onClick={toggleModal}>&times;</span>
                        </div>
                        <form onSubmit={crearCatalogo} id='crearForm'>

                            <div className='flexGrap'>
                                <fieldset>
                                    <legend>Nombre</legend>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                        placeholder="Nombre"
                                    />
                                </fieldset>

                                <fieldset>
                                    <legend>Email</legend>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Email"
                                    />
                                </fieldset>
                                <fieldset>
                                    <legend>Rol</legend>
                                    <select
                                        id="rol"
                                        name="rol"
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione un rol</option>
                                        <option value="usuario">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </fieldset>

                                <fieldset>
                                    <legend>Contraseña</legend>
                                    <div className='deFlexPass'>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="contrasena"
                                            name="contrasena"
                                            value={contrasena}
                                            onChange={(e) => setContrasena(e.target.value)}
                                            required
                                            placeholder="Contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </fieldset>

                            </div>
                            {mensaje2 ? (
                                <button type="button" className='btnLoading' disabled>
                                    {mensaje2}
                                </button>
                            ) : (
                                <button type="submit" className='btnSave'>
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
