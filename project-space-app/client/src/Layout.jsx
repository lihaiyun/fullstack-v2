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
            <AppBar position="static" className="AppBar">
                <Container>
                    <Toolbar disableGutters={true}>
                    <Link to="/">
                        <Typography variant="h6" component="div">
                        Project Space
                        </Typography>
                    </Link>
                    <Link to="/projects" ><Typography>Projects</Typography></Link>
                    <Link to="/form" ><Typography>Form</Typography></Link>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    {user && (
                        <>
                            <Typography>{user.name}</Typography>
                            <Button onClick={logout}>Logout</Button>
                        </>
                        )
                        }
                        {!user && (
                        <>
                            <Link to="/register" ><Typography>Register</Typography></Link>
                            <Link to="/login" ><Typography>Login</Typography></Link>
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