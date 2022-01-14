import Alert from '@mui/material/Alert';


export const Modal = ({text, propDisplay}) => {

    console.log(propDisplay)

    return <Alert 
    severity="error"
    sx={{
        display: propDisplay,
    }}
    >{text}</Alert>
}