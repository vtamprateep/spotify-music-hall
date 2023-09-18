import { NavLink } from "react-router-dom";
import './NavBar.css';
import logo from './assets/logo.png';
import { useNavigate } from 'react-router-dom';

const config = require('./config.json');


function NavBar() {
  const navigate = useNavigate();

  const getRandArtist = () => {
    fetch(`http://${config.server_host}:${config.server_port}/randomartist/`)
      .then(res => res.json())
      .then(data => {
        navigate('/artist/' + data.creator_id);
    });
  }

  const getRandVenue = () => {
    fetch(`http://${config.server_host}:${config.server_port}/randomvenue/`)
      .then(res => res.json())
      .then(data => {
        navigate('/venue/' + data.venue_id);
    });
  }

  return (
    <div>
      <nav className='navBackground'>
        <div className="logo">
          <NavLink exact="true" to="/">
          <img className="logoImg" src={ logo } alt="Music Hall"></img>
          </NavLink>
        </div>

        <div className="flexContainer">
          <NavLink
              className={({ isActive }) =>
              isActive ? 'isactive navBox': 'inactive navBox'}
              exact="true" to="/timeline">
                <div className="navIcon timeline"></div><div className="navWords">Timeline</div>
          </NavLink>

          <NavLink
              className={({ isActive }) =>
              isActive ? 'isactive navBox': 'inactive navBox'}
              exact="true" to="/search">
                <div className="navIcon search"></div><div className="navWords">Search</div>
          </NavLink>

          <NavLink
              className={({ isActive }) =>
              isActive ? 'isactive navBox': 'inactive navBox'}
              exact="true" to="/playlist">
                <div className="navIcon playlist"></div><div className="navWords">Playlist</div>
          </NavLink>

          <NavLink
              className={({ isActive }) =>
              'inactive navBox'}
              exact="true" onClick={() => getRandArtist()}>
                <div className="navIcon artistRand"></div><div className="navWords">Random Artist</div>
          </NavLink>

          <NavLink
              className={({ isActive }) =>
              'inactive navBox'}
              exact="true" onClick={() => getRandVenue()}>
                <div className="navIcon venueRand"></div><div className="navWords">Random Venue</div>
          </NavLink>

        </div>

      </nav>
    </div>
  );
}

export default NavBar;
