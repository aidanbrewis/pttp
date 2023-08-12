import { createTheme } from "@material-ui/core";


const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(186, 186, 186, 1)',
        },
        secondary: {
            main: '#494c7d',
        }
    },
    fontFamily: [
        'Roboto',
    ].join(','),
    h1: {
        fontsize: '5rem',
        fontFamily: 'Roboto'
    },
    h2: {
        fontsize: '3.5rem',
        fontFamily: 'Roboto',
    },
    spacing: {
        ten: 10
    }
});

export default theme