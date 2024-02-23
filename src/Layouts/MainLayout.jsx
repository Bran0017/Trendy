import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarProfile from '../Components/NavbarProfile/NavbarProfile';
export default function MainLayout() {


    return (
        <div>
            <NavbarProfile />
            <Outlet />

        </div>
    );
}
