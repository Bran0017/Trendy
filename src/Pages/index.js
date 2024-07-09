import IndexLayout from "../Layouts/IndexLayout";
import MainLayout from "../Layouts/MainLayout";
import PagesLayaut from '../Layouts/PagesLayaut'
import { createBrowserRouter } from "react-router-dom";
import Productos from '../Pages/Productos/Productos'
import Usuarios from '../Pages/Usuarios/Usuarios'
import Banners from "./Banners/Banners";
import Main from "./Main/Main";
import Contacto from "./Contacto/Contacto";
import Categorias from "./Categorias/Categorias";
import Codigos from "./Codigos/Codigos";
import PageDetail from '../Pages/PageDetail/PageDetail';
import SubCategorias from "./SubCategorias/SubCategorias";
import PageProductos from "./PageProductos/PageProductos";
export const router = createBrowserRouter([

    {
        path: "/",
        element: <IndexLayout />,

    },
    {
        path: "/",
        element: <PagesLayaut />,
        children: [
            {
                path: `/producto/:idProducto/:producto`,
                element: <PageDetail />,
            },
            {
                path: `/productos`,
                element: <PageProductos />,
            },

        ]
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: `/dashboard`,
                element: <Main />,
            },
            {
                path: `/dashboard/productos`,
                element: <Productos />,
            },
            {
                path: `/dashboard/usuarios`,
                element: <Usuarios />,
            },
            {
                path: `/dashboard/banners`,
                element: <Banners />,
            },
            {
                path: `/dashboard/contacto`,
                element: <Contacto />,
            },
            {
                path: `/dashboard/categorias`,
                element: <Categorias />,
            },
            {
                path: `/dashboard/subcategorias`,
                element: <SubCategorias />,
            },
            {
                path: `/dashboard/codigos`,
                element: <Codigos />,
            },
        ],
    },


]);
