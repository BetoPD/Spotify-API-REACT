import './App.css';
import Login from './Login';
import Header from './Header';
import React, {useState, useEffect} from 'react';
import { getTokenFromURL } from './spotify';


function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = getTokenFromURL();
    const _token = hash.access_token;
    window.location.hash = '';

    if(_token) {
      setToken(_token);
    } 

  },[]);

  return (
    <div>
      {token? <Header token={token}/> : <Login />}
    </div>
  );
}

export default App;
