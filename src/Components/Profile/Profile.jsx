import React from 'react'
import logo from '../../images/logo.png'
import './Profile.css'
import { Link as Anchor } from 'react-router-dom';
export default function Profile() {
    return (
        <div className='profileContain'>
            <img src={logo} alt="" />
            <h2>Restaurante</h2>
            <div className='socials'>
                <Anchor to='' target="_blank"><i class='fa fa-instagram'></i></Anchor>
                <Anchor to='' target="_blank"><i class='fa fa-whatsapp'></i></Anchor>
                <Anchor to='' target="_blank"><i class='fa fa-share'></i></Anchor>
            </div>
        </div>
    )
}
