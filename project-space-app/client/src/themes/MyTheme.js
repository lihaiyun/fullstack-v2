// https://mui.com/material-ui/customization/color/
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0d47a1', // Blue 900
        },
        secondary: {
            main: '#f4511e', // Deep Orange 900
        }
    },
    components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none', // Disable uppercase text globally
            },
          },
        },
      },
});

export default theme;