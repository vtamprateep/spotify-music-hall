import './App.css';
import NavBar from './NavBar';
import Artist from './artist/artist';
import Venue from './venue/venue';
import Timeline from './timeline/timeline';
import Playlist from './playlist/playlist';
import Search from './search/search';
import Login from  './login/login';
import { Route, Routes } from "react-router-dom";
import "@fontsource/inter"
import { useEffect, useState } from "react";

function App() {
  const [viewLogIn, setViewLogIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('musicHallToken');
    if (token) {
      let json = JSON.parse(token);
      setLoggedIn(true);
      setName(json.name);
      setUserId(json.user_id);
      setEmail(json.email);
    }

  }, []);

  const receiveData = (json) => {
    setLoggedIn(true);
    localStorage.setItem('musicHallToken', JSON.stringify(json));
    setName(json.name);
    setUserId(json.user_id);
    setEmail(json.email);
  }

  const logOut = () => {
    if (loggedIn) {
      localStorage.removeItem('musicHallToken');
      setName('');
      setUserId('');
      setEmail('');
      setLoggedIn(false);
    }
  }

  return (
    <div className="App">
      <Login open={viewLogIn} onClose={() => setViewLogIn(false)} logIn={(json) => receiveData(json)}/>
      <div className="topBar">
        {loggedIn && <div className="nameDisplay"><p>Welcome, {name}!</p><button className="login" onClick={() => logOut()}>Logout</button></div>}
        {!loggedIn && <button className="login" onClick={() => setViewLogIn(true)}>Login</button>}

      </div>
      <NavBar />
      <div className="contain">
        <div className="contain-2">
          <div className="routePanel">
            <Routes>
              <Route exact path="/" element={<Timeline />} />
              <Route exact path="/timeline" element={<Timeline />} />
              <Route exact path="/search" element={<Search />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/artist/:artist_id" element={<Artist/>} />
              <Route path="/venue/:venue_id" element={<Venue />} />
              <Route path="*" element={<Timeline />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
