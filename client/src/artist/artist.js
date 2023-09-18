import SongCard from '../songcard/songcard.js';
import './artist.css';
import Accordion from '@mui/material/Accordion';
import { Divider } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import defaultAlbum from '../assets/default_album.png';
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const config = require('../config.json');

function Artist(props) {
    const [load, setLoad] = useState(true);
    const [loadSimAlbumFor, setLoadSimAlbumFor] = useState(null);
    const [ready, setReady] = useState(false);
    const [noArtist, setNoArtist] = useState(false);
    const params = useParams();
    const [link, setWikiLink] = useState("");
    const [summary, setSummary] = useState("Loading...");
    const [title, setTitle] = useState("Artist");
    const [topSong, setTopSong] = useState({
        "track_name": "",
        "artist_name": "",
        "release_date": "",
        "track_preview_url": "https://p.scdn.co/mp3-preview/80a49eba7f6517d4f1364e5b0a96d5dd08cff4ef?cid=4253f1c121cd47208ee35324d5b090b2",
        "album_image": "",
        "album_title": "",
        "duration": ""
    });
    const [albums, setAlbums] = useState([
        {"album_name": "Loading...",
        "album_id": "00ao0DAIYS0BNEbnbH0UCf",
        "release_date": "",
        "album_image": "",
        "song_list": [
            topSong,
            topSong
        ]}
    ]);

    //const [simAlbums, setSimAlbums] = useState([]);

    const [simAlbums, setSimAlbums] = useState(new Map())

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/artist/${params.artist_id}`)
          .then(res => res.json())
          .then(data => {
            //console.log("data", data);
            if (Object.keys(data).length === 0) {
                setNoArtist(true);
                setLoad(false);
                return;
            }
            setWikiLink("https://en.wikipedia.org/wiki/" + data.artist_name);
            let string = new DOMParser().parseFromString(data.summary, "text/html");
            setSummary(string.firstChild.innerText.substring(0, 1000) + "...");
            setTitle(data.artist_name);
            setTopSong(data.top_song);
            let sorted = data.album_list.sort((a, b) => {
                return a.release_date.localeCompare(b.release_date) * -1
              });
            setAlbums(sorted);
            setReady(true);
            setLoad(false);
        });
      }, [params.artist_id]);

      useEffect(() => {
        if (!ready) {
            setReady(true);
        } else {
            if (simAlbums.has(loadSimAlbumFor.album_id)) {
                return;
            }
            fetch(`http://${config.server_host}:${config.server_port}/similaralbums/?number_of_albums=3`, {
                method: "POST",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "album_id": loadSimAlbumFor.album_id
                })
            })
            .then(res => res.json())
            .then(resJson => {
                setSimAlbums(new Map(simAlbums.set(loadSimAlbumFor.album_id, resJson)));
            });
        }
      }, [loadSimAlbumFor]);

      const timeCalc = (song) => {
        let zero = ((song.duration % 60000) / 1000).toFixed(0) < 10 ? '0' : '';
        let string = '';
        return (string + Math.floor(song.duration / 60000).toString() + ":" + ((song.duration % 60000) / 1000).toFixed(0).toString() + zero);
      }

      const renderPage = () => {
        if (noArtist) {
            return (
            <div className="noArtist">
                No artist with that ID exists! Try another ID.
            </div>)
        } else {
            return (
            <div>
            <div className="top">
                <div className="text">
                    <h1>{title}</h1>
                    <p>{summary}</p>
                    <a href={link} target="_blank">Read More {'>'}</a>
                </div>
                <div>
                    <SongCard songInfo={topSong} title="Top Song"/>
                </div>
            </div>
            <div className="bottom">
                <h2 className="albumsTitle">Albums</h2>
                <div className="listContainer">
                    {albums.map((album, index) => (
                        <div key={index}>
                        <Accordion onChange={() => setLoadSimAlbumFor(album)}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <div className="horizontalAccordionTitle">
                                <img onError={(e) => e.target.src = defaultAlbum} className="albumAccordion" src={album.album_image ? album.album_image : defaultAlbum} alt="album art"></img>
                                <div className="accordionTitle">
                                    <p className="accordionMainTitle">{album.album_name ? album.album_name : "Loading..."}</p>
                                    <p className="accordionSecondTitle">{album.release_date ? album.release_date.substring(0, 4) : "Loading..."}</p>
                                </div>
                            </div>

                            </AccordionSummary>
                            <AccordionDetails className="outerSongContainer">
                                {album.song_list.map((song, albumIndex) => (
                                    <div className="song" key={albumIndex}>
                                        <div className="songInfo">
                                            <p className="accordionMainTitle">{song.track_name}</p>
                                            <p className="accordionSecondTitle">{"Duration: " + timeCalc(song)}</p>
                                        </div>
                                        <div className="songInfo">
                                            <audio className="musicAccordion" controls="controls">
                                                <source src={song.track_preview_url} type="audio/mpeg"/>
                                            </audio>
                                        </div>
                                    </div>
                                ))}
                                {simAlbums.get(album.album_id)===undefined ? <div className="simAlbums2"><p className="accordionMainTitle">Similar Albums:</p><CircularProgress /></div> : simAlbumsLoading(album.album_id)}

                            </AccordionDetails>
                        </Accordion>
                        {index !== albums.length-1 ? <Divider variant="middle"/> : null}
                        </div>
                    ))}
                </div>

            </div>
            </div>)}
      }

      const simAlbumsLoading = (index) => {
        if (simAlbums.get(index)!==undefined) {
            return (
                <div className="simAlbums">
                <p className="accordionMainTitle">Similar Albums:</p>
                <div className="simAlbumContainer">
                {console.log("TESTING",index)}
                {simAlbums.get(index).map((alb, ind) => (
                    <div className="simAlbumBox" key={ind}>
                        <a className="simAlbumLink" href={"/artist/" + alb.artist_id}>
                        <img onError={(e) => e.target.src = defaultAlbum} className="albumAccordion" src={alb.album_image} alt="album art"></img>
                        <div className="textSimAlbums">
                        <p className="accordionMainTitle2">{alb.album_name}</p>
                        <p className="accordionSecondTitle">{alb.album_artist}</p>
                        </div>
                        </a>
                    </div>
                ))}
                </div>
                </div>
            )
        } else {
            return (
                <div className="simAlbums2"><p className="accordionMainTitle">Similar Albums:</p><CircularProgress /></div>
            )
        }
      }

    return (
        <div className="main">
            {load ? <div className="loadContainer"><CircularProgress /></div> : renderPage()}
        </div>
    );
}

export default Artist;
