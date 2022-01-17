import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';



export const MessageForm = ({sendMessage, data}) => {

    const [message, setMessage] = useState({message: ''});

    useEffect(() => {
        console.log('effect form data')
    },[data.isMutted])


    return (
        <Box 
        component="form" 
        onSubmit = {(e) =>
            {
                e.preventDefault()
                sendMessage(message);
                setMessage({message: ''});
             }}
             
            sx={{
                display: 'flex',
                margin: '20px 5px'
            }}>
        
          <TextareaAutosize
            id="outlined-basic" 
            label="Type a message..." 
            variant="outlined" 
            value={message.message}
            placeholder='type you message...'
            minRows={3}
            maxRows={4}
            onChange={e => setMessage({...message, message: e.target.value})}
            style={{
                width: '80%',
                resize: 'none',
                borderRadius: '4px',
            }}
            /> 
            <Button 
            variant="contained" 
            type='submit'
            disabled={data.isMutted}
            style={{
                width: '20%',
            }}
            >Send</Button>
        </Box>            
    )

}