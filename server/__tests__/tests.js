const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json");

test('GET /song/songId', async () => {
  await supertest(app).get('/song/123')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.song)
    });
});

test('GET /album/albumId', async () => {
  await supertest(app).get('/album/55')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.album)
    });
});

test('GET /artist/artistId', async () => {
  await supertest(app).get('/artist/1234')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.artist)
    });
});

test('GET /concert/concertId', async () => {
  await supertest(app).get('/concert/777')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.concert)
    });
});

