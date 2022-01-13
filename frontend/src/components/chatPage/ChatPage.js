import Container from '@mui/material/Container';
import { MessageForm } from './messageForm/MessageForm';
import { MessageList} from './messageList/MessageList';
import Button from '@mui/material/Button';
import { UserInfo } from './userInfo/UserInfo';
import { Userslist } from './usersList/UsersList';
import Box from '@mui/material/Box';
import {io} from 'socket.io-client';
import { useEffect, useState } from 'react';








export const ChatPage = ({ onExit, token }) => {

    const newtoken = token;
    const [socket, setSocket] = useState(null);

    // const getSocket = () => {

    //     console.log('connecting to socket ')
    //     if(newtoken){
    //         const SERVER_URL = 'http://localhost:5000';
    //         const socket = io.connect(SERVER_URL, {
    //                         auth: {token: newtoken}
    //                         });
    //             if(socket){
    //                 console.log(socket)
    //                 socket.on('connected', (data) => {
    //                             console.log( data.userName , 'connected to chat...');
    //                             }).on('error', (e) => {
    //                             console.log(e)
    //                     }); 
    //             }
    //     }         
    // }
  
    useEffect(() => {
        if(newtoken){
            const SERVER_URL = 'http://localhost:5000';
            setSocket(io.connect(SERVER_URL, {
                auth: {token: newtoken}
            }))
        }
    }, [])

    useEffect(() => {
        if(socket){
            socket.on('connected', (data) => {
                        console.log( data.userName , 'connected to chat...');
                        }).on('error', (e) => {
                        console.log(e)
                }); 
        }
    }, [socket])


    return (
        <Container maxWidth="lg">
            <Box 
            sx={{
                display: 'flex',
            }}>
                <Box
                sx={{
                    display: 'flex',
                    flexGrow:'2',
                    flexDirection: 'column',
                    
                }}
                >
                    <MessageList></MessageList>
                    <MessageForm></MessageForm>
                </Box>
                <Box
                sx={{
                  
                    display: 'flex',
                    flexDirection: 'column',
                    
                }}
                >
                    <UserInfo></UserInfo>
                    <Userslist></Userslist>
                    <Button variant="contained" onClick={()=> {
                        socket.disconnect()
                        setSocket(null)
                        onExit()
                    }}>Logout</Button>

                </Box>
  
            </Box>
         
        </Container>
        
    )

}