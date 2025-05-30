import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
// npm install @mui/x-date-pickers
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function MyForm() {
    const formData = {
        title: 'My title',
        description: 'My description',
        price: 0,
        option: 'A',
        date: dayjs().add(1, 'day'),
        time: dayjs().minute(0),
        datetime: dayjs().add(1, 'day').minute(0),
        tnc: true
    };
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const mySchema = yup.object().shape({
        title: yup.string().trim()
            .min(3, 'Title must be at least 3 characters')
            .max(100, 'Title must be at most 100 characters')
            .required('Title is required'),
        description: yup.string().trim()
            .min(3, 'Description must be at least 3 characters')
            .max(500, 'Description must be at most 500 characters')
            .required('Description is required'),
        price: yup.number().min(0).required('Price is required'),
        option: yup.string().required('Option is required'),
        date: yup.date().typeError('Invalid date').required('Date is required'),
        time: yup.date().typeError('Invalid time').required('Time is required'),
        datetime: yup.date().typeError('Invalid date time').required('Date Time is required'),
        tnc: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required')
    });

    const formik = useFormik({
        initialValues: formData,
        validationSchema: mySchema,
        onSubmit: (data) => {
            // create a new object for submission
            let dataToSubmit = { ...data };
            dataToSubmit.title = data.title.trim();
            dataToSubmit.description = data.description.trim();
            // Convert date, time and datetime to string
            dataToSubmit.date = data.date.format('YYYY-MM-DD');
            dataToSubmit.time = data.time.format('HH:mm');
            dataToSubmit.datetime = data.datetime.format();
            // If image is uploaded, add imageId and imageUrl to data
            if (imageFile) {
                dataToSubmit.imageId = imageFile.imageId;
                dataToSubmit.imageUrl = imageFile.imageUrl;
            }
            console.log(dataToSubmit);
            toast.success('Form submitted successfully');
        }
    });

    const onFileChange = async (e) => {
        let file = e.target.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            toast.error('Maximum file size is 1MB');
            return;
        }

        let formData = new FormData();
        formData.append("file", file);
    
        setUploadingImage(true);
        try {
            const res = await http.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setImageFile(res.data);
        } catch (error) {
            console.error("Upload failed:", error.response.data);
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                My Example Form
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{xs:12, md:6, lg:8}} container spacing={2}>
                        <Grid size={{xs:12}}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        <Grid size={{xs:12}}>
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
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                type="number"
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        step: 0.1
                                    }
                                }}
                                label="Price"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price} />
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <FormControl fullWidth margin="dense"
                                error={formik.touched.option && Boolean(formik.errors.option)}>
                                <InputLabel>Option</InputLabel>
                                <Select label="Option"
                                    name="option"
                                    value={formik.values.option}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value={'A'}>Option A</MenuItem>
                                    <MenuItem value={'B'}>Option B</MenuItem>
                                    <MenuItem value={'C'}>Option C</MenuItem>
                                    <MenuItem value={'D'}>Option D</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.option && formik.errors.option}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker format="DD/MM/YYYY"
                                        label="Select Date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={(date) => formik.setFieldValue('date', date)}
                                        onBlur={() => formik.setFieldTouched('date', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.date && Boolean(formik.errors.date),
                                                helperText: formik.touched.date && formik.errors.date
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Select Time"
                                        name="time"
                                        value={formik.values.time}
                                        onChange={(time) => formik.setFieldValue('time', time)}
                                        onBlur={() => formik.setFieldTouched('time', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.time && Boolean(formik.errors.time),
                                                helperText: formik.touched.time && formik.errors.time
                                            }
                                        }} />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid size={{xs:12}}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker format="DD/MM/YYYY hh:mm A"
                                        label="Select Date Time"
                                        name="datetime"
                                        value={formik.values.datetime}
                                        onChange={(datetime) => formik.setFieldValue('datetime', datetime)}
                                        onBlur={() => formik.setFieldTouched('datetime', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.datetime && Boolean(formik.errors.datetime),
                                                helperText: formik.touched.datetime && formik.errors.datetime
                                            }
                                        }} />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid size={{xs:12, md:6, lg:4}}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                    onChange={onFileChange} />
                            </Button>
                            {
                                uploadingImage ? (
                                    <Box sx={{ mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    imageFile && imageFile.imageUrl && (
                                        <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                            <img alt="project"
                                                src={imageFile.imageUrl}>
                                            </img>
                                        </Box>
                                    )
                                )
                            }
                        </Box>
                    </Grid>

                    <Grid size={{xs:12}}>
                        <FormControl fullWidth margin="dense"
                            error={formik.touched.tnc && Boolean(formik.errors.tnc)}>
                            <FormControlLabel control={
                                <Checkbox name="tnc"
                                    checked={formik.values.tnc}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            } label="I Accept Terms & Conditions" />
                            <FormHelperText>{formik.touched.tnc && formik.errors.tnc}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default MyForm;