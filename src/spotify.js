export const endPoint = 'https://accounts.spotify.com/authorize';
const redirectURL = 'http://localhost:3000/';
const clientId = 'a7a78045a85148a5b3cf0dd8d583c50c';

const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-top-read',
    'user-modify-playback-state',
    'playlist-modify-private',
    'playlist-modify-public',
    'app-remote-control'
];

export const loginURL = `${endPoint}?client_id=${clientId}&redirect_uri=${redirectURL}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export const getTokenFromURL = () => {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
};