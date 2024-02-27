import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
export default function MainLayout() {


    return (
        <div className='section-bg-color'>


            <Outlet />
        </div>
    );
}
