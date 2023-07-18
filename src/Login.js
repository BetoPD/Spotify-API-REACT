import React, {useState} from 'react';
import { loginURL } from './spotify';


export default function Login() {

    const handleClick = () => {
        window.location.href = loginURL;
    };

    return (
        <>
            <h1>SPOTIFY</h1>
            <button onClick={handleClick}>Login to spotify</button>
        </>
    );
}