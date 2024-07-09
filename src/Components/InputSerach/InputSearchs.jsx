import React, { useState, useEffect } from "react";
import "./InputSearchs.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import baseURL from '../url';
export default function InputSearchs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducto, setFilteredProducto] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [productos, setProductos] = useState([]);
    useEffect(() => {
        cargarProductos();

    }, []);
    const cargarProductos = () => {
        fetch(`${baseURL}/productosGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos || []);
                console.log(data.productos)
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };
    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const results = productos.filter((producto) => {
            return (
                producto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredProducto(results);
        setShowResults(searchTerm !== "");
        setNoResults(searchTerm !== "" && results.length === 0);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="fondo-input">
            <div className="search-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={openModal} />



                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modalInput"
                    overlayClassName="overlayInput">
                    <fieldset className="inputSearch" >
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="input"
                        />
                    </fieldset>
                    {showResults && (
                        <div className="modalSearch">
                            {filteredProducto.map((item) => (
                                <div key={item.idProducto}>

                                    <Link to={`/producto/${item.idProducto}/${item.titulo.replace(/\s+/g, '-')}`} onClick={closeModal}>
                                        <img src={item.imagen1} alt="" /><p>{item.titulo} - {item.categoria}</p>
                                    </Link>
                                </div>
                            ))}
                            {noResults && <p>No se encontraron resultados.</p>}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
