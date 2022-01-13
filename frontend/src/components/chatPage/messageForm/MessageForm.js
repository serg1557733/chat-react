import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';



export const MessageForm = ({sendMessage}) => {

    const [message, setMessage] = useState({message: ''});
     
    return (
        <>
          <TextField id="outlined-basic" 
            label="Type a message..." 
            variant="outlined" 
            value={message.message}
            onChange={e => setMessage({...message, message: e.target.value})}

            /> 
            <Button variant="contained" onClick={()=> {
                sendMessage(message);
                setMessage({message: ''});
             }}>Send</Button>
        </>    
            
    )

}