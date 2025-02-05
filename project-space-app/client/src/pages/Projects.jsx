import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Projects() {
    const [projectList, setProjectList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getProjects = () => {
        http.get('/projects').then((res) => {
            //console.log(res.data);
            setProjectList(res.data);
        });
    };

    const searchProjects = () => {
        http.get(`/projects?search=${search}`).then((res) => {
            setProjectList(res.data);
        });
    };

    useEffect(() => {
        getProjects();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchProjects();
        }
    };

    const onClickSearch = () => {
        searchProjects();
    };

    const onClickClear = () => {
        setSearch('');
        getProjects();
    };

    function formatText(text) {
        return text
          .split('-') // Split by "-"
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
          .join(' '); // Join with space
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Projects
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addproject">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    projectList.map((project, i) => {
                        return (
                            <Grid size={{xs:12, md:6, lg:4}} key={project._id}>
                                <Card>
                                    {
                                        project.imageUrl && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="project"
                                                    src={project.imageUrl}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {project.name}
                                            </Typography>
                                            {
                                                user && user._id === project.owner._id && (
                                                    <Link to={`/editproject/${project._id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {project.owner?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography sx={{ flexGrow: 1 }}>
                                                {dayjs(project.dueDate).format(global.dateFormat)}
                                            </Typography>
                                            <Typography>
                                                {formatText(project.status)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {project.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Projects;