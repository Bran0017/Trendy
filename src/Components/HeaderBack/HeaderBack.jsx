import React from 'react'
import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './HeaderBack.css'
export default function HeaderBack({ link, title }) {
    const navigate = useNavigate();
    const goBack = () => {
        // Aquí puedes realizar otras acciones antes de volver atrás, si es necesario
        navigate(-1); // Vuelve atrás en la historia del navegador
    };
    return (
        <div className='headerBack'>
            <div onClick={goBack} className='back'>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <span>
                {title}
            </span>
        </div>
    )
}
