import React from "react";

function Playlist({ playlist }) {

    return (
        <>
            <ul>
                {playlist.map(song => <li>{song}</li>)}
            </ul>
        </>
    );
};

export default Playlist;