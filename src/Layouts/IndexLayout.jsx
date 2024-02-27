import React, { useState, useEffect } from 'react';
import Nabvar from '../Components/Navbar/Navbar'
import Demo from '../Pages/Demo/Demo'
export default function IndexLayout() {




    return (
        <div className='section-bg-color'>
            <Nabvar />
            <div className='espaciobg'>

            </div>
            <Demo />
        </div>
    );
}
