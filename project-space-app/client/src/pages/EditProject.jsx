import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { CircularProgress } from '@mui/material';
// npm install @mui/x-date-pickers
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const projectSchema = yup.object().shape({
    name: yup.string().trim()
        .required('Name is required')  
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 100 characters'),
    description: yup.string()
        .max(500, 'Description must be at most 500 characters'),
    dueDate: yup.date()
        .required('Due date is required'),
    status: yup.string()
        .required('Status is required')
        .oneOf(['not-started', 'in-progress', 'completed'], 'Invalid status'),
    imageId: yup.string().max(100),
    imageUrl: yup.string().max(200)
});

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        name: '',
        description: '',
        dueDate: dayjs().add(1, 'month'),
        status: '',
    });
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);

    const setImage = (data) => {
        setProject({ ...project, 
            imageId: data.imageId,
            imageUrl: data.imageUrl
         });
    }

    useEffect(() => {
        http.get(`/projects/${id}`).then((res) => {
            // Convert dueDate to a dayjs object
            res.data.dueDate = dayjs(res.data.dueDate);
            setProject(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: project,
        enableReinitialize: true,
        validationSchema: projectSchema,
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.description = data.description.trim();
            // Convert dueDate to string
            data.dueDate = data.dueDate.format('YYYY-MM-DD');
            //console.log(data);
            http.put(`/projects/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/projects");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProject = () => {
        http.delete(`/projects/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/projects");
            });
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            setUploadingImage(true);
            let formData = new FormData();
            formData.append('file', file);
            http.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImage(res.data);
                    setUploadingImage(false);
                })
                .catch(function (error) {
                    console.log(error.response);
                    setUploadingImage(false);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Project
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12, md:6, lg:8}}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                                <FormControl fullWidth margin="dense">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker format="DD/MM/YYYY"
                                            label="Due Date"
                                            name="dueDate"
                                            value={formik.values.dueDate}
                                            onChange={(dueDate) => formik.setFieldValue('dueDate', dueDate)}
                                            onBlur={() => formik.setFieldTouched('dueDate', true)}
                                            slotProps={{
                                                textField: {
                                                    error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                                                    helperText: formik.touched.dueDate && formik.errors.dueDate
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <FormControl fullWidth margin="dense"
                                    error={formik.touched.status && Boolean(formik.errors.status)}>
                                    <InputLabel>Status</InputLabel>
                                    <Select label="Status"
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <MenuItem value={'not-started'}>Not Started</MenuItem>
                                        <MenuItem value={'in-progress'}>In Progress</MenuItem>
                                        <MenuItem value={'completed'}>Completed</MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid size={{xs:12, md:6, lg:4}}>
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />
                                    </Button>
                                    {
                                        uploadingImage && (
                                            <Box sx={{ mt: 2 }}>
                                                <CircularProgress />
                                            </Box>
                                        )
                                    }
                                    {
                                        !uploadingImage && project.imageUrl && (
                                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                                <img alt="project"
                                                    src={project.imageUrl}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Project
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteProject}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}

export default EditProject;