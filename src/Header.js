import React, {useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

function Header({ token }) {
    const [name, setName] = useState('Unknown');
    const [input, setInput] = useState('');
    const [songs, setSongs] = useState([]);
    const [songsIds, setSongsIds] = useState([]);
    const [playlist, setPlayList] = useState([]);
    const [playlistIds, setPlayListIds] = useState([]);
    const [playlistName, setPlaylistName] = useState('');

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
    }, [token]);

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

    const addToPlaylist = ({ target }) => {

        const getSongName = async (id) => {
            try {
                const songName = await spotify.getTrack(id)
                    .then(response => response.name);    
                setPlayList(prev => [...prev, songName]);
            } catch (error) {
                console.log(error);
            };
        };
        
        let alreadyIn = false; 

        for(let i = 0; i < playlistIds.length; i++) {
            if (playlistIds[i] === target.value) {
                alreadyIn = true;
                break;
            }
        }

        if (alreadyIn) {
            alert("Song already in playlist!!");
            return;
        }

        getSongName(target.value);
        setPlayListIds(prev => [...prev, target.value]);

    };

    const removeFromPlaylist = ({ target }) => {
        
        const deleteName = async ({ value }) => {
            const name = await spotify.getTrack(value) 
                .then(response => response.name);
            
            setPlayList(prev => prev.filter(x => x !== name));
        };
        setPlayListIds(prev => prev.filter(x => x !== target.value));
        deleteName(target);
    };

    const handleSubmition = () => {

        if (playlistIds.length < 1) { 
            alert("Add songs to the playlist!!");
        } else if (!playlistName.replace(/\s/g, '').length) {
            alert("Playlist does not have a name!!");
        } else {
            alert('Playlist created!!');
        }
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
            <div>
                <div className="Songs">
                    <ul>
                        {songs.map((song, index) => {
                            return (
                                <li key={`${song}-${index}`}>
                                    {song}
                                    <button value={songsIds[index]} type='button' onClick={addToPlaylist}>Add to playlist</button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="Playlist">
                    <h3>Your Playlist</h3>
                    <label htmlFor='playlist-name'>Playlist Name:</label>
                    <input 
                        id='playlist-name'
                        type='text'
                        value={playlistName}
                        onChange={e => setPlaylistName(e.target.value)}
                    />
                    <ul>
                        {playlist.map((song, index) => <li key={`${index}-${song}`}>{song}<button value={playlistIds[index]} type="button" onClick={removeFromPlaylist}>Remove from playlist</button></li>)}
                    </ul>
                    <button type="button" onClick={handleSubmition}>Add Playlist to Spotify</button>
                </div>
            </div>
        </header>
    );
};

export default Header;

