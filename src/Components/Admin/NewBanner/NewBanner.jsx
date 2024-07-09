import React, { useState } from 'react';
import './NewBanner.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';

export default function NewBanner() {
    const [mensaje, setMensaje] = useState('');
    const [imagenPreview, setImagenPreview] = useState(null);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleImagenChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImagenPreview(previewURL);
            setIsImageSelected(true);
        }
    };

    const crear = async () => {
        const form = document.getElementById("crearForm");
        const formData = new FormData(form);
        const resetForm = () => {
            form.reset();
            setImagenPreview(null);
            setIsImageSelected(false);
        };
        setMensaje('');

        if (!formData.get('imagen')) {
            toast.error('Por favor, seleccione una imagen.');
            return;
        }

        setMensaje('Procesando...');

        try {
            const response = await fetch(`${baseURL}/bannersPost.php`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.mensaje) {
                setMensaje('');
                resetForm();
                toast.success(data.mensaje);
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
                <span>  +</span>   Agregar
            </button>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className='deFlexBack'>
                            <h4>Agregar Banner</h4>
                            <span className="close" onClick={toggleModal}>&times;</span>
                        </div>
                        <form id="crearForm">
                            <div className="flexGrap">
                                <fieldset>
                                    <legend>
                                        Imagen
                                    </legend>
                                    <label htmlFor="imagen"> </label>
                                    <input
                                        type="file"
                                        id="imagen"
                                        name="imagen"
                                        accept="image/*"
                                        onChange={handleImagenChange}
                                        required
                                    />
                                </fieldset>
                            </div>
                            {isImageSelected &&
                                <div className='previevCategori'>
                                    {<img src={imagenPreview} alt="Vista previa" />}
                                </div>
                            }
                            {mensaje ? (
                                <button type="button" className='btnLoading' disabled>
                                    {mensaje}
                                </button>
                            ) : (
                                <button type="button" onClick={crear} className='btnPost'>
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
