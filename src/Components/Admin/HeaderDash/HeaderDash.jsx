import React, { useState } from 'react';
import './HeaderDash.css';
import ButonScreen from '../ButonScreen/ButonScreen';
import InputSearch from '../InputSearch/InputSearch';
import InfoUser from '../InfoUser/InfoUser';
import ButonInstallAppNav from '../ButonInstallAppNav/ButonInstallAppNav'
export default function HeaderDash() {


    return (
        <div className={`HeaderDashContain`}>
            <InputSearch />

            <div className='deFlexHeader'>
                <ButonScreen />
                <ButonInstallAppNav />
                <InfoUser />
            </div>


        </div>
    );
}
