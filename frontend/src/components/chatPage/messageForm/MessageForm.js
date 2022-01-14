import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import e from 'cors';



export const MessageForm = ({sendMessage}) => {

    const [message, setMessage] = useState({message: ''});
     
    return (
        <form onSubmit = {(e) =>
            {
                e.preventDefault()
                sendMessage(message);
                setMessage({message: ''});
             }

        }>
          <TextField id="outlined-basic" 
            label="Type a message..." 
            variant="outlined" 
            
            value={message.message}
            onChange={e => setMessage({...message, message: e.target.value})}

            /> 
            <Button 
            variant="contained" 
            type='submit'
            >Send</Button>
        </form>            
    )

}