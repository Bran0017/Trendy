import React, { useEffect, useState } from 'react';
import { Link as Anchor } from "react-router-dom";
import './ProductosMain.css'
import baseURL from '../../url';
export default function ProductosMain() {
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
                setProductos(data.productos.reverse().slice(0, 5) || []);
                console.log(data.productos)
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };


    return (


        <div className='table-containerProductos'>
            <div className='deFlexMore'>
                <h3>Ultimos {productos?.length} productos</h3>
                <Anchor to={`/dashboard/productos`} className='logo'>
                    Ver más
                </Anchor>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>IdProducto</th>
                        <th>Titulo</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Categoria</th>
                        <th>Imagen 1</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(item => (
                        <tr key={item.idProducto}>
                            <td>{item.idProducto}</td>
                            <td>{item.titulo}</td>
                            <td>{item.descripcion}</td>
                            <td style={{
                                color: '#008000',
                            }}>
                                ${`${item?.precio}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </td>

                            <td style={{
                                color: '#DAA520',

                            }}>  {`${item?.categoria}`}</td>
                            <td>
                                {item.imagen1 ? (
                                    <img src={item.imagen1} alt="imagen1" />
                                ) : (
                                    <span className='imgNonetd'>
                                        Sin imagen
                                    </span>
                                )}
                            </td>


                        </tr>
                    ))}
                </tbody>

            </table>
        </div>

    );
};
