import requests
import time
import json
import csv

# Get a new token from this address: https://developer.spotify.com/console/get-artist-albums/?id=&include_groups=&market=&limit=&offset=
token = ''

class Song:
  def __init__(self, uri, disc_number, duration, explicit):
    self.uri = uri.replace("spotify:track:","")
    self.disc_number = disc_number
    self.duration = duration
    self.explicit = explicit

    def __str__(self):
        return self.uri

number_of_artists_to_download = 50
artist_list = []

with open("cleaned_500.csv", mode='r') as cleaned:
    for count, row in enumerate(cleaned):
        if count == 0:
            continue
        print(row.split(',')[0])
        artist_list.append(row.split(',')[0])
        if count == number_of_artists_to_download:
            break

artist_ids = []
with open("artists_data_spotify.csv", mode='w') as artist_file:
    csvwriter = csv.writer(artist_file)
    csvwriter.writerow(['name', 'id', 'spotify_url', 'followers', 'genres', 'popularity', 'images'])
    for index, artist in enumerate(artist_list):
        try:
            print(index)
            response = requests.get(f'https://api.spotify.com/v1/search?q={artist}&type=artist&limit=3', headers={'Authorization': f'Bearer {token}'})
            start = time.time()
            json_data = response.json()

            # write to artists file
            row = [None, None, None, None, None, None, None]
            row[0] = json_data['artists']['items'][0]['name']
            row[1] = json_data['artists']['items'][0]['id']
            row[2] = json_data['artists']['items'][0]['external_urls']['spotify']
            row[3] = json_data['artists']['items'][0]['followers']['total']
            row[4] = json_data['artists']['items'][0]['genres']
            row[5] = json_data['artists']['items'][0]['popularity']
            row[6] = json_data['artists']['items'][0]['images']
            csvwriter.writerow(row) 

            artist_ids.append(json_data['artists']['items'][0]['id'])
            end = time.time()
            if (end - start) < 0.16:
                time.sleep(.16-(end-start))
        except:
            print("Error")
            print(json_data)
            token = input("Token expired. Enter new access token\n")

print("Total Artists:", len(artist_ids))

albums = []
with open("albums_data_spotify.csv", mode='w') as album_file:
    csvwriter = csv.writer(album_file)
    csvwriter.writerow(['artist_id', 'album_id', 'spotify_url', 'images', 'name', 'release_date', 'total_tracks'])
    for index, artist in enumerate(artist_ids):
        try:
            print(index)
            response = requests.get(f'https://api.spotify.com/v1/artists/{artist}/albums?limit=10', headers={'Authorization': f'Bearer {token}'})
            start = time.time()
            json_data = response.json()
            for album in json_data['items']:
                row = []
                row.append(artist)
                row.append(album['id'])
                row.append(album['external_urls']['spotify'])
                row.append(album['images'])
                row.append(album['name'])
                row.append(album['release_date'])
                row.append(album['total_tracks'])
                csvwriter.writerow(row)
                albums.append(album['id'])

            end = time.time()
            if (end - start) < 0.16:
                time.sleep(.16-(end-start))
        except:
            print("Error")
            print(json_data)
            token = input("Token expired. Enter new access token\n")

print("Total Albums:", len(albums))

songs = []
for index, album in enumerate(albums):
    try:
        print(index)
        response = requests.get(f'https://api.spotify.com/v1/albums/{album}/tracks?limit=50', headers={'Authorization': f'Bearer {token}'})
        start = time.time()
        json_data = response.json()
        for track in json_data['items']:
            songs.append(Song(track['uri'], track['disc_number'], track['duration_ms'], track['explicit']))
        end = time.time()
        if (end - start) < 0.16:
            time.sleep(.16-(end-start))
    except:
        print("Error")
        print(json_data)
        token = input("Token expired. Enter new access token\n")

print("Total Tracks:", len(songs))

with open("songs_data_spotify.csv", mode='w') as song_file:
    csvwriter = csv.writer(song_file)
    csvwriter.writerow(['album_id', 'song_id', 'name', 'track_number', 'duration_ms', 'explicit', 'popularity', 'preview_url'])
    total_tracks_written = 0
    start = 0
    end = len(songs)
    step = 50
    for i in range(start, end, step):
        x = i
        song_id_list = ",".join(str(song.uri) for song in songs[x:x+step])
        print(x+step)
        start = time.time()
        response = requests.get(f'https://api.spotify.com/v1/tracks?ids={song_id_list}', headers={'Authorization': f'Bearer {token}'})
        start = time.time()
        json_data = response.json()
        try:
            for track in json_data["tracks"]:
                row = []
                row.append(track['album']['id'])
                row.append(track['id'])
                row.append(track['name'])
                row.append(track['track_number'])
                row.append(track['duration_ms'])
                row.append(track['explicit'])
                row.append(track['popularity'])
                row.append(track['preview_url'])
                csvwriter.writerow(row)
                total_tracks_written+=1

            end = time.time()
            if (end - start) < 0.16:
                time.sleep(.16-(end-start))
            if total_tracks_written % 1000 == 0:
                print("Tracks dumped to file:", total_tracks_written)
        except:
            print("Error")
            print(json_data)
            token = input("Token expired. Enter new access token\n")

