import { createTheme } from "@material-ui/core";


const Theme = createTheme({
    palette: {
        primary: {
            main: '#2a961',
        },
        secondary: {
            main: '#494c7d',
        }
    },
    fontFamily: [
        'Roboto',
        'Raleway',
        'Open Sans'
    ].join(','),
    h1: {
        fontsize: '5rem',
        fontFamily: 'Roboto'
    },
    h2: {
        fontsize: '3.5rem',
        fontFamily: 'Open Sans',
    },
    spacing: {
        ten: 10
    }
});

export default Theme