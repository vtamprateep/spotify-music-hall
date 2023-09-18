import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Grid, Slider } from '@mui/material';
import { useState } from 'react';
import SongCard from '../songcard/songcard.js';
import './timeline.css';
const config = require('../config.json')

function Timeline() {

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
    const [year, setYear] = useState([1934, 2023]);
    const [givenSongList, setGivenSongList] = useState([]);
    // can allow user to pick how many songs they want to see maybe
    const [songNumber, setSongNumber] = useState(30);

    const handleChange = (event, newYears) => {
        setYear(newYears);
    }

    const fetchTracks = (year_start, year_end, genres) => {
        const genre_data = [];
        for (let key in genres) {
            const item = genres[key];
            if (item['value'] === true) {
                genre_data.push(key);
            }
        };
        fetch(`http://${config.server_host}:${config.server_port}/randomsongs/?year_start=${year_start}&year_end=${year_end}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "songs_required": songNumber,
                "genres": genre_data
            })
        })
            .then((res) => res.json())
            .then((res_data) => {
                let sorted = res_data.sort((a, b) => {
                    return a.release_date.localeCompare(b.release_date)
                  });
                setGivenSongList(sorted);
            })
    }

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

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

    return (
        <div className="timelineParent">
            <h1>Timeline</h1>
            <p>Select music genres and a time range to view a timeline of songs.</p>
            <Grid
                container
                rowSpacing={2}
                align="center"
            >
                <Grid item xs={12}>
                    <div className="buttons">
                        {Object.keys(genres).map((key, index) => {
                            return(
                                <button key={index} className={genres[key]['value'] ? "activeButton genres" : "genres"} onClick={() => setGenres({...genres, [key]: {'search': genres[key]['search'], 'value': !genres[key]['value']}})}>{key}</button>
                            )
                        })}
                    </div>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                    <button onClick={() => fetchTracks(year[0], year[1], genres)}>Search</button>
                </Grid>
                <Grid item xs={12}>
                    <Carousel
                        responsive={responsive}
                        showDots={true}
                        partialVisbile
                        draggable
                    >
                        {givenSongList.map((item) => {
                            return <div>
                                    <SongCard songInfo={item} artist={true}/>
                                </div>
                        })}
                    </Carousel>
                </Grid>
            </Grid>

        </div>
    );
}

export default Timeline;
