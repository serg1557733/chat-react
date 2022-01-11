
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { sendForm } from './utils/sendForm';



export const LoginForm = () => {

    const [userData, setUserdata] = useState({userName:'', password: ''});

    const POST_URL = 'http://localhost:5000/login';

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData)
        sendForm(POST_URL, userData);
        setUserdata({userName:'', password: ''});
    }

    
    return (
        <Container maxWidth="xs">
            <Box
            component="form" 
            onSubmit={(e) => handleSubmit(e)}
            sx={{
                marginTop: 40,
                display: 'flex',
                flexDirection: 'column',
            }}
            >
                <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="user name"
                name="userName"
                autoComplete="email"
                autoFocus
                value={userData.userName}
                onChange={e => setUserdata({...userData, userName: e.target.value})}
                
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userData.password}
                onChange={e => setUserdata({...userData, password: e.target.value})}

                />
                <Button 
                type="submit"
                variant="contained"
                fullWidth>Login
                </Button>
            </Box>
        </Container>
    )
}