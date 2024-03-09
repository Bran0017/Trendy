import React, { useEffect, useState } from 'react';
import './ButonInstallAppNav.css';


const ButonInstallAppNav = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log('Evento beforeinstallprompt capturado');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);


    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('El usuario aceptó la instalación');
                } else {
                    console.log('El usuario rechazó la instalación');
                }
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <button onClick={handleInstallClick} className='btnInstall' >
            Instalar acceso
        </button>
    );
};

export default ButonInstallAppNav;

//style={{ display: deferredPrompt ? 'block' : 'none' }}