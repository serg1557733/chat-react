
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { sendForm } from './utils/sendForm';
import { Modal } from '../modal/Modal';


export const LoginForm = ({ onSubmit}) => {

    const [userData, setUserdata] = useState({userName:'', password: ''});
    const [textModal, setTextModal] = useState('')
    const [display, setDisplay] = useState('none');


    const POST_URL = 'http://localhost:5000/login';


    const isValidPayload = ({userName, password}) => {
        return (userName.trim().length > 2 && password.trim().length > 4) 
    }

    const isValidUserName = ({userName}) => {
        const nameRegex = /[^A-Z a-z0-9]/ ;
        return !nameRegex.test(userName);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isValidPayload({...userData}) && isValidUserName({...userData})){
            const data = await sendForm(POST_URL, userData);
            const token = data.token;
            if(token){
                onSubmit(token);     
            }
            setTextModal(data.message)
            setDisplay('block')
            setUserdata({userName:'', password: ''});
            
            
        } else {
            setTextModal('too short or using special symbols')
            setDisplay('block')
            console.log('too short or using special symbols') // later do user aler
        }
        
    }

    useEffect(()=>{
        return () => {
            setUserdata({userName:'', password: ''})
        }
    }, [])

    
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
                onChange={e => {
                    setUserdata({...userData, userName: e.target.value})
                    setDisplay('none')
                }}
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
                <Modal 
                text={textModal}
                propDisplay = {display}
                
                ></Modal>
                <Button 
                type="submit"
                variant="contained"
                fullWidth>Login
                </Button>
            </Box>
        </Container>
    )
}