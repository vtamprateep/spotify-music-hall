import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { NavLink } from "react-router-dom";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { useState } from 'react';
import './search.css';
const config = require("../config.json");


function Search() {

    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("")
    const [columns, setColumns] = useState([{
            field: 'venue_name',
            headerName: 'Venue name',
            width: 300,
            renderCell: (row) => (<NavLink to={`/venue/${row.venue_id}`}>{row.venue_name}</NavLink>)
        },
        {
            field: 'venue_location',
            headerName: 'Location',
            width: 100
        },
        {
            field: 'number_of_concerts',
            headerName: 'Total Concerts',
            width: 100
        }]);
    const [searchType, setSearchType] = useState("CONCERT");

    const columnsVenue = [
        {
            field: 'venue_name',
            headerName: 'Venue name',
            width: 300,
            renderCell: (row) => (<NavLink to={`/venue/${row.venue_id}`}>{row.venue_name}</NavLink>)
        },
        {
            field: 'venue_location',
            headerName: 'Location',
            width: 100
        },
        {
            field: 'number_of_concerts',
            headerName: 'Total Concerts',
            width: 100
        }
    ];

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
            width: 100
        },
        {
            field: 'count_of_concerts',
            headerName: 'Concert(s) Performed',
            width: 100
        },
    ];

    const handleSearch = (search) => {
        setPage(1); // New search, go back to first page
        setSearch(search);
        if (searchType === "CONCERT") {
            fetch(`http://${config.server_host}:${config.server_port}/concertsearch/?search=${search}&page=${1}&page_size=${pageSize}`)
                .then(res => res.json())
                .then(res_json => {
                    if (res_json.keys() !== []) {
                        setData(res_json);
                    }
                });
        } else {
            fetch(`http://${config.server_host}:${config.server_port}/creatorsearch/?search=${search}&page=${1}&page_size=${pageSize}`)
                .then(res => res.json())
                .then(res_json => {
                    if (res_json.keys() !== []) {
                        setData(res_json);
                    }
                });
        }
    }

    const handleSearchTypeChange = (new_value) => {
        setSearchType(new_value);
        if (new_value === "CONCERT") {
            setColumns(columnsVenue);
        } else {
            setColumns(columnsCreator);
        }
        setData([]);
    }

    const handleChangePage = (e, newPage) => {
        console.log(newPage);
        if (newPage < page || data.length === pageSize) {
            setPage(newPage + 1);
            if (searchType === "CONCERT") {
                fetch(`http://${config.server_host}:${config.server_port}/concertsearch/?search=${search}&page=${newPage + 1}&page_size=${pageSize}`)
                    .then(res => res.json())
                    .then(res_json => setData(res_json));
            } else {
                fetch(`http://${config.server_host}:${config.server_port}/creatorsearch/?search=${search}&page=${newPage + 1}&page_size=${pageSize}`)
                    .then(res => res.json())
                    .then(res_json => setData(res_json));
            }
        }
    }

    const handleChangePageSize = (e) => {
        setPageSize(e.target.value);
        setPage(1);
        if (searchType === "CONCERT") {
            fetch(`http://${config.server_host}:${config.server_port}/concertsearch/?search=${search}&page=${11}&page_size=${e.target.value}`)
                .then(res => res.json())
                .then(res_json => setData(res_json));
        } else {
            fetch(`http://${config.server_host}:${config.server_port}/creatorsearch/?search=${search}&page=${11}&page_size=${e.target.value}`)
                .then(res => res.json())
                .then(res_json => setData(res_json));
        }
    }

    const defaultRenderCell = (col, row) => {
        console.log(col, row);
        return <div>
            {row[col.field]}
        </div>;
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: grey[100],
            },
            secondary: {
                main: grey[500],
            }
        }
    })

    return (
        <div>
            <Grid
                container
                rowSpacing={2}
                alignItems={"center"}
            >
                <Grid item xs={12}>
                    <h1>Venue & Artist Search</h1>
                    <p>Search for specific music artists or concert venues.</p>
                </Grid>
                <Grid item xs={8}>
                    <input type="text" id="searchInputField" placeholder="Enter text here..."/>
                </Grid>
                <Grid item xs={2}>
                    <button onClick={() => handleSearch(document.getElementById("searchInputField").value)}>Search</button>
                </Grid>
                <Grid item xs={2}>
                    <ThemeProvider theme={theme}>
                    <ToggleButtonGroup
                        value={searchType}
                        exclusive
                        color="primary"
                    >
                        <ToggleButton
                            value="ARTIST"
                            onClick={() => handleSearchTypeChange("ARTIST")}
                        >
                            <div className="white">Artists</div>
                        </ToggleButton>
                        <ToggleButton
                            value="CONCERT"
                            onClick={() => handleSearchTypeChange("CONCERT")}
                        >
                            <div className="white">Concerts</div>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map(col =>
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
                                {data.map((row, idx) =>
                                    <TableRow key={idx}>
                                    {
                                        columns.map(col =>
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
                                rowsPerPage={pageSize}
                                page={page - 1}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangePageSize}
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

export default Search;
