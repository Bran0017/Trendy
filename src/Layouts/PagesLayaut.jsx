import React, { useState, useEffect } from 'react';
import Nabvar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';

import Footer from '../Components/Footer/Footer'
import BtnWhatsapp from '../Components/BtnWhatsapp/BtnWhatsapp'
export default function IndexLayout() {




    return (
        <div >
            <Nabvar />
            <div className='espaciobg2'>

            </div>
            <Outlet />
            <Footer />

            <BtnWhatsapp />
        </div>
    );
}
