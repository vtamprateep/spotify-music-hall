const express = require('express');
const bp      = require('body-parser')
const cors    = require('cors');
const config  = require('./config');
const routes  = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// routes here
app.get('/test', routes.test);
app.get('/song/:songId', routes.song);
app.get('/artist/:artist_id', routes.artist);
app.get('/album/:albumId', routes.album);
app.get('/concert/:concertId', routes.concert);

app.get('/concertsearch/', routes.concertsearch);
app.get('/creatorsearch/', routes.creatorsearch);
app.get('/venuetopcreator/:venue_id', routes.venuetopcreator);
app.get('/recentconcert/:venue_id', routes.recentconcert);
app.get('/venuename/:venue_id', routes.venuename);
app.post('/randomsongs/' , routes.randomsongs);
app.post('/playlists/', routes.playlists);
app.post('/similaralbums/', routes.similaralbums);
app.get('/randomvenue/', routes.randomvenue);
app.get('/randomartist/', routes.randomartist);
app.post('/login/', routes.login);
app.post('/signup/', routes.signup);

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
