
import { useEffect, useState } from 'react';

const config = require('./config.json');

function Main() {

    const [testString, setTestString] = useState("the backend is not connected!");
    const [songTestString, setSongString] = useState("no song");
    const [artistTestString, setArtistString] = useState("no artist");
    const [albumTestString, setAlbumString] = useState("no album");
    const [concertTestString, setConcertString] = useState("no concert");

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/test`)
        .then(res => res.text())
        .then(resJson => {setTestString(resJson); console.log(testString);});
    }, [testString]);

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/song/123`)
        .then(res => res.text())
        .then(resJson => {setSongString(resJson); console.log(songTestString)});
    }, [songTestString]);

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/artist/1234`)
        .then(res => res.text())
        .then(resJson => {setArtistString(resJson); console.log(artistTestString)});
    }, [artistTestString]);

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/concert/777`)
        .then(res => res.text())
        .then(resJson => {setConcertString(resJson); console.log(concertTestString)});
    }, [concertTestString]);

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/album/55`)
        .then(res => res.text())
        .then(resJson => {setAlbumString(resJson); console.log(albumTestString)});
    }, [albumTestString]);

    return (
        <div>
          {testString}
          <br/><br/>
          <text>Test calling api for given songId 123: </text>
          {songTestString}
          <br/><br/>
          <text>Test calling api for given artistId 1234: </text>
          {artistTestString}
          <br/><br/>
          <text>Test calling api for given albumId 55: </text>
          {albumTestString}
          <br/><br/>
          <text>Test calling api for given concertId 777: </text>
          {concertTestString}
        </div>
    );
}

export default Main;
