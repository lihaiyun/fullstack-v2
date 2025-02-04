// https://mui.com/material-ui/customization/color/
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#388e3c', // Green 600
        },
        secondary: {
            main: '#f4511e', // Deep Orange 900
        }
    }
});

export default theme;