import React from 'react'
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { Outlet, Link } from 'react-router'
import UserContext from './contexts/UserContext'
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';

function Layout() {
    const { user } = React.useContext(UserContext);

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    return (
        <ThemeProvider theme={MyTheme}>
            <AppBar position="static">
                <Container>
                    <Toolbar disableGutters>
                        {/* Navigation Links */}
                        <Button color="inherit" component={Link} to="/" sx={{ fontSize: '1.1rem' }} >
                            Project Space
                        </Button>
                        <Button color="inherit" component={Link} to="/projects">
                            Projects
                        </Button>
                        <Button color="inherit" component={Link} to="/form">
                            Form
                        </Button>

                        {/* Push the rest of the content to the right */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* User Section */}
                        {user ? (
                            <>
                                <Typography sx={{ mr: 2 }}>{user.name}</Typography>
                                <Button color="inherit" onClick={logout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/register">Register</Button>
                                <Button color="inherit" component={Link} to="/login">Login</Button>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </ThemeProvider>
    )
}

export default Layout