import Container from '@mui/material/Container';
import { MessageForm } from './messageForm/MessageForm';
import { MessageList} from './messageList/MessageList';
import Button from '@mui/material/Button';
import { UserInfo } from './userInfo/UserInfo';
import { Userslist } from './usersList/UsersList';
import Box from '@mui/material/Box';
import {io} from 'socket.io-client';
import { useEffect, useState, useRef} from 'react';
import { Moment } from 'moment-timezone';



export const ChatPage = ({ onExit, token }) => {

    const newtoken = token;
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([])

     
    useEffect(() => {
        if(newtoken){
            try {
                const SERVER_URL = 'http://localhost:5000';
                setSocket(io.connect(SERVER_URL, {
                    auth: {token: newtoken}
                }) )
    
            } catch (error) {
                console.log(error)
            } 
        }
    }, [])

    const sendMessage = (data) => {
        if (data.message && data.message.length < 200) {
            console.log('send..' , data)
            socket.emit('message', data); 
        } 
    };

    useEffect(() => {
        if(socket){
            socket.on('connected', (data) => {
                console.log( data , 'connected to chat...');
                }).on('error', (e) => {
                console.log(e)
            }); 
            socket.on('allmessages', (data) => {
                    setMessages(data)
                    console.log( data , 'get messasges useEffect');
                    }).on('error', (e) => {
                    console.log(e)
            }); 
            socket.on('usersOnline', (data) => {
                console.log( data , 'online');
                }).on('error', (e) => {
                console.log(e)
            });  
            socket.on('allDbUsers', (data) => {
                console.log( data , 'all users from db');
                }).on('error', (e) => {
                console.log(e)
            }); 
            socket.on('disconnect', (data) => {
                console.log( data, 'token');
                }).on('error', (e) => {
                console.log(e)
            });  
            socket.on('message', (data) => {
                setMessages((messages) => [...messages, data] )
                }).on('error', (e) => {
                console.log(e)
            });    
        }
    }, [socket])
  
    console.log(messages)
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
                {messages.map((item, index) =>
                    <div key={index}>
                       <span>{item.userName}</span>
                       <div>{item.text}</div>
                      {item.isAdmin ?  '' : <span>admin</span>}
                      <div>{item.createDate}</div>
                    </div>
                )}
                    
                    <MessageForm sendMessage = {(data) => {
                        sendMessage(data)
                    }}></MessageForm>
                </Box>
                <Box
                    sx={{
                    
                        display: 'flex',
                        flexDirection: 'column',
                        
                    }}
                >
                    <UserInfo></UserInfo>
                    <Userslist></Userslist>
                    <Button variant="contained"

                     onClick={(e)=> {
                        socket.disconnect()
                        onExit()
                    }}>Logout</Button>

                </Box>
  
            </Box>
         
        </Container>
        
    )

}