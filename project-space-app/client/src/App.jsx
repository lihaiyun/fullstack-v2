import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import Layout from './Layout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/users/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
            <Routes>
              <Route path={"/"} element={<Layout />}>
                <Route index element={<Projects />} />
                <Route path="projects" element={<Projects />} />
                <Route path="addproject" element={<AddProject />} />
                <Route path="editproject/:id" element={<EditProject />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="form" element={<MyForm />} />
              </Route>
            </Routes>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
