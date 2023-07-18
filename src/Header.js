import React, {useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

function Header({ token }) {
    const [name, setName] = useState("Unknown");

    useEffect(() => {
        const getName = async () => {
            try {
                const _name = await spotify.getMe();
                
                if (_name) {
                    setName(_name.display_name);
                }
            } catch(error) {
                console.log(error);
            }
        }

        spotify.setAccessToken(token);
        getName();
    }, []);

    return (
        <header>
            <h1>Hello {name}!!</h1>
            <h2>Welcome to your spotify assistant!!</h2>
            <p>In this website you'll be able to create a playlist and add it to your account</p>
        </header>
    );
};

export default Header;

