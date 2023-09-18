import './songcard.css';
import defaultAlbum from '../assets/default_album.png';
import { useEffect, useState, useRef } from "react";

function SongCard(props) {
    const [player, setPlayer] = useState("");
    const [title, setTitle] = useState(null);
    const [showArtist, setShowArtist] = useState(false);
    const [album, setAlbum] = useState("");
    const [song, setSong] = useState("");
    const [albumTitle, setAlbumTitle] = useState("");
    const [year, setYear] = useState("");
    const [artist, setArtist] = useState("");
    const music = useRef();

    useEffect(() => {
        setTitle(props.title);
        setPlayer(props.songInfo.track_preview_url);
        setShowArtist(props.artist);
        setAlbum(props.songInfo.album_image);
        setSong(props.songInfo.track_name);
        setAlbumTitle(props.songInfo.album_name);
        setYear(props.songInfo.release_date.substring(0, 4));
        setArtist(props.songInfo.artist_name);
    }, [props]);

    useEffect(() => {
        if (music.current) {
            music.current.pause();
            music.current.load();
        }
    }, [player]);

    return (
        <div className="base">
            {title &&
            <h3>{title}</h3>
            }
            {!title &&
            <h3>{year}</h3>
            }
            <div className="centerContainer">
                <div className="songcardContainer">
                    <img onError={(e) => e.target.src = defaultAlbum} className="album" src={album} alt="album art"></img>
                    <h3>{song}</h3>
                    <h4>{showArtist ? artist : albumTitle}</h4>
                </div>
                <audio className="music" controls="controls" ref={music}>
                    <source src={player} type="audio/mpeg"/>
                </audio>
            </div>


        </div>
    );
}

export default SongCard;
