import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import './ButonScreen.css'
export default function ButonScreen() {
    const [isFullScreen, setFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setFullScreen(true));
        } else {
            document.exitFullscreen().then(() => setFullScreen(false));
        }
    };
    return (
        <button className='FullScreenButton' onClick={toggleFullScreen}>
            <FontAwesomeIcon icon={faExpand} />
        </button>
    )
}
