import React, {useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

function Header({ token }) {
    const [name, setName] = useState('Unknown');
    const [input, setInput] = useState('');
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        spotify.setAccessToken(token);
    }, [token]);

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

        getName();
    }, []);

    const search = async (value) => {
        try {
            const _songs = await spotify.searchTracks(value)
                .then(value => value.tracks.items[0].id)
                .then(value => spotify.getTrack(value))
                .then(value => value.name);
            
            console.log(typeof _songs);
            setSongs(prev => [...prev, _songs])

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (value) => {
        setInput(value);
        search(value);
    };

    return (
        <header>
            <h1>Hello {name}!!</h1>
            <h2>Welcome to your spotify assistant!!</h2>
            <p>In this website you'll be able to create a playlist and add it to your account</p>
            <input 
                placeholder="Search for a song" 
                value={input} 
                onChange={e => handleChange(e.target.value)}
            />
            <div className="Songs">
                <ul>
                    {songs.map((song, index) => <li key={`${song}-${index}`}>{song}</li>)}
                </ul>
            </div>
        </header>
    );
};

export default Header;

