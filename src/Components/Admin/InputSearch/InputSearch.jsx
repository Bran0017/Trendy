import React, { useState } from 'react';
import './InputSearch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
export default function InputSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const enlaces = [
        { title: 'Productos', link: '/dashboard/productos' },
        { title: 'Banners', link: '/dashboard/banners' },
        { title: 'Usuarios', link: '/dashboard/usuarios' },
        { title: 'Contacto', link: '/dashboard/contacto' },

    ];



    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        setModalOpen(searchTerm !== "");
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const filteredEnlaces = enlaces.filter((enlace) =>
        enlace.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (


        <div className="inputSearchDashboard">
            <div className='search'>
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="input"
                />
            </div>
            {modalOpen && (
                <div className="modalInput">
                    {filteredEnlaces.length > 0 ? (
                        filteredEnlaces.map((enlace, index) => (
                            <div key={index}>

                                <Link to={enlace.link} onClick={closeModal} className='link'>
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    {enlace.title}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No hay resultados.</p>
                    )}
                </div>
            )}
        </div>



    );
}
