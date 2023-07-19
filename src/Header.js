import React, {useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Playlist from "./Playlist";

const spotify = new SpotifyWebApi();

function Header({ token }) {
    const [name, setName] = useState('Unknown');
    const [input, setInput] = useState('');
    const [songs, setSongs] = useState([]);
    const [songsIds, setSongsIds] = useState([]);
    const [playlist, setPlayList] = useState([]);

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

            const _songsIds = await spotify.searchTracks(value)
                .then(response => {
                    const firstFive = response.tracks.items.slice(0, 5);
                    const firstFiveIds = firstFive.map(song => song.id);
                    return firstFiveIds;    
                });
            
            const _songs = [];
            
            for(let i = 0; i < _songsIds.length; i++) {
                let _songName = await spotify.getTrack(_songsIds[i])
                .then(response => response.name);
                _songs.push(_songName);
            };
                
            if (_songs && _songsIds) {
                setSongsIds(_songsIds);
                setSongs(_songs);
            };
            
        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (value) => {
        setInput(value);
        if (value.replace(/\s/g, '').length) {
            search(value);
        };
    };

    const onClick = ({ target }) => {
        
        let alreadyIn = false; 

        for(let i = 0; i < playlist.length; i++) {
            if (playlist[i] === target.value) {
                alreadyIn = true;
                break;
            }
        }

        if (alreadyIn) {
            alert("Song already in playlist!!");
            return;
        }

        setPlayList(prev => [...prev, target.value]);

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
                    {songs.map((song, index) => {
                        return (
                            <li key={`${song}-${index}`}>
                                {song}
                                <button value={songsIds[index]} type='button' onClick={onClick}>Add to playlist</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </header>
    );
};

export default Header;

