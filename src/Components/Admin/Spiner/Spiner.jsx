import React from 'react';
import logo from '../../../images/logo.png';
import './Spiner.css';  // Asegúrate de importar el archivo CSS donde definirás los estilos del spinner.

export default function Spiner() {
    return (
        <div className='spinnerContainer'>
            <div className='spinner'>
                <img src={logo} alt="Spinner" className='spinnerImage' />
                <p>Cargando...</p>
            </div>
        </div>
    );
}
