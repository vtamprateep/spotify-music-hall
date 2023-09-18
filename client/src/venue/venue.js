import { Grid } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const config = require('../config.json');

function Venue() {
    const params = useParams();
    //console.log("test this! on page reload this should be available to you!", params.venue_id);

    const [pageSizeCreator, setPageSizeCreator] = useState(10);
    const [pageCreator, setPageCreator] = useState(1);
    const [creatorData, setCreatorData] = useState([]);
    const [venueName, setVenueName] = useState();

    const [pageSizeConcert, setPageSizeConcert] = useState(10);
    const [pageConcert, setPageConcert] = useState(1);
    const [concertData, setConcertData] = useState([]);

    const columnsCreator = [
        {
            field: 'creator_name',
            headerName: 'Creator name',
            width: 300,
            renderCell: (row) => (<NavLink to={`/artist/${row.creator_id}`}>{row.creator_name}</NavLink>)
        },
        {
            field: 'creator_popularity',
            headerName: 'Popularity',
            width: 300
        },
        {
            field: 'count_of_concerts',
            headerName: 'Total Concerts',
            width: 300
        }
    ];

    const columnsConcert = [
        {
            field: 'concert',
            headerName: 'Concert Name',
            width: 100
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 100
        }
    ]

    const handleChangePageConcert = (e, newPage) => {
        console.log(newPage);
        if (newPage < pageConcert || concertData.length === pageSizeConcert) {
            setPageConcert(newPage + 1);
            const venue_id = document.URL.split("/").pop();
            fetch(`http://${config.server_host}:${config.server_port}/recentconcert/${venue_id}/?page=${newPage + 1}&page_size=${pageSizeConcert}`)
                .then(res => res.json())
                .then(resJson => setConcertData(resJson));
        }
    }

    const handleChangePageSizeConcert = (e) => {
        setPageSizeConcert(e.target.value);
        setPageConcert(1);
        const venue_id = document.URL.split("/").pop();
        fetch(`http://${config.server_host}:${config.server_port}/recentconcert/${venue_id}/?page=${1}&page_size=${e.target.value}`)
            .then(res => res.json())
            .then(resJson => setConcertData(resJson));
    }

    const handleChangePageCreator = (e, newPage) => {
        if (newPage < pageCreator || creatorData.length === pageSizeCreator) {
            setPageCreator(newPage + 1);
            const venue_id = document.URL.split("/").pop();
            fetch(`http://${config.server_host}:${config.server_port}/venuetopcreator/${venue_id}/?page=${newPage + 1}&page_size=${pageSizeCreator}`)
                .then(res => res.json())
                .then(resJson => setCreatorData(resJson));
        }
    }

    const handleChangePageSizeCreator = (e) => {
        setPageSizeCreator(e.target.value);
        setPageCreator(1);
        const venue_id = document.URL.split("/").pop();
        fetch(`http://${config.server_host}:${config.server_port}/venuetopcreator/${venue_id}/?page=${1}&page_size=${e.target.value}`)
            .then(res => res.json())
            .then(resJson => setCreatorData(resJson));
    }

    useEffect(() => {  // Run once on component load
        const venue_id = document.URL.split("/").pop();

        // Load venue name
        fetch(`http://${config.server_host}:${config.server_port}/venuename/${venue_id}`)
            .then(res => res.json())
            .then(resJson => setVenueName(resJson[0].name));
        console.log(venueName);

        // Load initial list of creators
        fetch(`http://${config.server_host}:${config.server_port}/venuetopcreator/${venue_id}/?page=${pageCreator}&page_size=${pageSizeCreator}`)
            .then(res => res.json())
            .then(resJson => setCreatorData(resJson));
        console.log(creatorData);

        // Load initial list of concerts
        fetch(`http://${config.server_host}:${config.server_port}/recentconcert/${venue_id}/?page=${pageConcert}&page_size=${pageSizeConcert}`)
            .then(res => res.json())
            .then(resJson => setConcertData(resJson));
        console.log(concertData);
    }, [])

    const defaultRenderCell = (col, row) => {
        return <div>
            {row[col.field]}
        </div>;
    }

    return (
        <div>
            <Grid
                container
                rowSpacing={2}
            >
                <Grid item xs={12}>
                    <h1>{venueName}</h1>
                </Grid>
                <Grid item xs={12}>
                    <h3>Top Creators</h3>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead> {/* Top most popular artists */}
                                <TableRow>
                                    {columnsCreator.map(col =>
                                        <TableCell
                                            key={col.headerName}
                                            sx={{
                                                color: "white",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {col.headerName}
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {creatorData.map((row, idx) =>
                                    <TableRow key={idx}>
                                    {
                                        columnsCreator.map(col =>
                                            <TableCell
                                                key={col.headerName}
                                                sx={{
                                                    color: "white"
                                                }}
                                            >
                                                {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
                                            </TableCell>
                                    )}
                                    </TableRow>
                                )}
                            </TableBody>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={-1}
                                rowsPerPage={pageSizeCreator}
                                page={pageCreator - 1}
                                onPageChange={handleChangePageCreator}
                                onRowsPerPageChange={handleChangePageSizeCreator}
                                sx={{
                                    color: "white"
                                }}
                            />
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <h3>Most Recent Concerts</h3>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead> {/* Most recent concerts */}
                                <TableRow>
                                    {columnsConcert.map(col =>
                                        <TableCell
                                            key={col.headerName}
                                            sx={{
                                                color: "white",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {col.headerName}
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {concertData.map((row, idx) =>
                                    <TableRow key={idx}>
                                    {
                                        columnsConcert.map(col =>
                                            <TableCell
                                                key={col.headerName}
                                                sx={{
                                                    color: "white"
                                                }}
                                            >
                                                {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
                                            </TableCell>
                                    )}
                                    </TableRow>
                                )}
                            </TableBody>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={-1}
                                rowsPerPage={pageSizeConcert}
                                page={pageConcert - 1}
                                onPageChange={handleChangePageConcert}
                                onRowsPerPageChange={handleChangePageSizeConcert}
                                sx={{
                                    color: "white"
                                }}
                            />
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
}

export default Venue;
