import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';


export const MessageForm = () => {
    return (
        <Container maxWidth="xs">

           <TextField id="outlined-basic" label="Type a message..." variant="outlined" />
        
        </Container>
        
    )

}