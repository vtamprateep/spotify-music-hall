import { Slider } from "@mui/material";
import './playlist.css';
import { useEffect, useState } from "react";
import SongCard from '../songcard/songcard.js';
import defaultAlbum from '../assets/default_album.png';
import { Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const config = require('../config.json');

function Playlist() {
    const [counter, setCounter] = useState(0);
    let maxCount = 15;
    const [start, setStart] = useState(false);
    const [load, setLoad] = useState(false);
    const [end, setEnd] = useState(false);
    const [year, setYear] = useState([1934, 2023]);

    const [genres, setGenres] = useState({
        'Rock': {
            'value': false,
            'search': 'rock'
        },
        'Pop': {
            'value': false,
            'search': 'pop'
        },
        'Metal': {
            'value': false,
            'search': 'metal'
        },
        'Dance': {
            'value': false,
            'search': 'dance'
        },
        'Hip Hop': {
            'value': false,
            'search': 'hip hop'
        },
        'Rap': {
            'value': false,
            'search': 'rap'
        },
        'Electro': {
            'value': false,
            'search': 'electr'
        },
        'Indie': {
            'value': false,
            'search': 'indie'
        },
        'Folk': {
            'value': false,
            'search': 'folk'
        },
        'Grunge': {
            'value': false,
            'search': 'grunge'
        },
        'Blues': {
            'value': false,
            'search': 'blues'
        },
        'Soul': {
            'value': false,
            'search': 'soul'
        },
        'R&B': {
            'value': false,
            'search': 'r&b'
        },
        'Wave': {
            'value': false,
            'search': 'wave'
        },
        'Mellow': {
            'value': false,
            'search': 'mellow'
        },
        'Punk': {
            'value': false,
            'search': 'punk'
        },
        'Synth': {
            'value': false,
            'search': 'synth'
        }
    });
    let arr = [];
    const placeholderSong = {
        "track_name": "Loading...",
        "artist_name": "Loading...",
        "release_date": "",
        "track_preview_url": "",
        "album_image": "",
        "album_name": "",
        "track_uri": ""
    };

    const [givenSongList, setGivenSongList] = useState([placeholderSong]);
    const [savedSongList, setSavedSongList] = useState([]);
    const [rejectedSongList, setRejectedSongList] = useState([]);
    const marks = [
        {
          value: 1934,
          label: '1934',
        },
        {
          value: 2023,
          label: '2023',
        }
      ];

    const handleChange = (event, newYears) => {
        setYear(newYears);
    }

    const handleStart = () => {
        setLoad(true);
        arr = [];
        for (let key of Object.keys(genres)) {
            if (genres[key].value) {
                arr.push(genres[key].search);
            }
        }
        if (arr.length === 0) {
            // get all genres if nothing selected...
            for (let key of Object.keys(genres)) {
                arr.push(genres[key].search);
            }
        }
        //console.log(arr);
        fetch(`http://${config.server_host}:${config.server_port}/randomsongs/?year_start=${year[0]}&year_end=${year[1]}`, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "songs_required": 15,
                "genres": arr
            })
        })
        .then(res => res.json())
        .then(data => {
          setGivenSongList(data);
          setLoad(false);
          setStart(true);
      });
    }

    const handleMoreSongs = () => {
        if (savedSongList.length < 15) {
            setLoad(true);
            let liked = [];
            let unliked = [];

            if (savedSongList.length > 0) {
                for (let item of savedSongList) {
                    liked.push(item.track_uri);
                }
            }
            //console.log("rej", rejectedSongList);
            if (rejectedSongList.length > 0) {
                for (let item of rejectedSongList) {
                    unliked.push(item.track_uri);
                }
            }
            //console.log("test", liked, unliked);

            fetch(`http://${config.server_host}:${config.server_port}/playlists`, {
                method: "POST",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "songs_required": 15,
                    "liked_songs": liked,
                    "unliked_songs": unliked
                })
            })
            .then(res => res.json())
            .then(data => {
                //console.log("data", data);
                if (data.song_recs.length > 0) {
                    setGivenSongList(data.song_recs);
                    setLoad(false);
                    setStart(true);
                } else {
                    fetch(`http://${config.server_host}:${config.server_port}/randomsongs/?year_start=${year[0]}&year_end=${year[1]}`, {
                        method: "POST",
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "songs_required": 15,
                            "genres": arr
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                    setGivenSongList(data);
                    setLoad(false);
                    setStart(true);
                });
                }
          });
        }
    }

    useEffect(() => {
        if (savedSongList.length === maxCount) {
            setEnd(true);
        }
    }, [savedSongList]);

    const acceptDeny = (bool) => {
        console.log("clicked", savedSongList.length);
        if (bool) {
            setSavedSongList(savedSongList => [...savedSongList, givenSongList[counter]]);
        } else {
            setRejectedSongList(rejectedSongList => [...rejectedSongList, givenSongList[counter]]);
        }
        setCounter(counter+1);

        if (savedSongList.length === maxCount) {
            setEnd(true);
            return;
        }
        if (counter === givenSongList.length - 1) {
            setCounter(0);
            handleMoreSongs();
        }
    }
    //TODO: fix bug where playing music and changing track_preview_url doesn't update properly
    const renderPage = () => {
        return (

        <div className="controls">
            <div className={(!start && !end) ? "transition" : "transparent"}>
                <div className="buttons">
                    {Object.keys(genres).map((key, index) => {
                        return(
                            <button key={index} className={genres[key]['value'] ? "activeButton genres" : "genres"} onClick={() => setGenres({...genres, [key]: {'search': genres[key]['search'], 'value': !genres[key]['value']}})}>{key}</button>
                        )
                    })}

                </div>
                <div className="slider">
                    <Slider
                        className="sliderBody"
                        value={year}
                        valueLabelDisplay="on"
                        onChange={handleChange}
                        marks={marks}
                        min={1934}
                        max={2023}
                    />
                </div>
                <div className="startButtonDiv">
                    <button className="startButton" onClick={() => handleStart()}>Start</button>
                </div>
            </div>
            <div className={start && !end ? "transition" : "transparent"}>
                    <div className="controlsSongs">
                        <button className="choice red" onClick={() => acceptDeny(false)}><div className="deny"></div></button>
                        <div className="backCardLight"></div>
                        <div className="backCard"></div>
                        <div className="card ">
                            <SongCard songInfo={counter < givenSongList.length ? givenSongList[counter] : placeholderSong} artist={true}/>
                        </div>
                        <button className="choice green" onClick={() => acceptDeny(true)}><div className="accept"></div></button>
                    </div>
                    <div className="count">{savedSongList.length}/{maxCount}</div>
            </div>
            <div className={start && end ? "transition" : "transparent"}>
                <div className="listContainer">
                    {savedSongList.map((song, index) => {
                        return (
                            <div key={index}>
                            <div className="songPlaylist">
                                <img onError={(e) => e.target.src = defaultAlbum} className="albumAccordion" src={song.album_image} alt="album art"></img>
                                <div className="songInfo">
                                    <p className="accordionMainTitle">{song.track_name}</p>
                                    <p className="accordionSecondTitle">{song.artist_name}</p>
                                </div>
                                <div className="songInfo">
                                    <audio className="musicAccordion" controls="controls">
                                        <source src={song.track_preview_url} type="audio/mpeg"/>
                                    </audio>
                                </div>
                            </div>
                            {index !== savedSongList.length-1 ? <Divider variant="middle"/> : null}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>)
    }

    return (
        <div className="mainDiv">
            <div className="text">
                <h1>Playlist</h1>
                <p>Select song genres and time periods to get started, then accept or reject song selections to create a playlist!</p>
            </div>
            {load ? <div className="loadContainer"><CircularProgress /></div> : renderPage()}
        </div>
    );
}

export default Playlist;
