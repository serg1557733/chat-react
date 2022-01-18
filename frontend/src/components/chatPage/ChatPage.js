import Container from '@mui/material/Container';
import { MessageForm } from './messageForm/MessageForm';
import Button from '@mui/material/Button';
import { UserInfo } from './userInfo/UserInfo';
import { Userslist } from './usersList/UsersList';
import Box from '@mui/material/Box';
import {io} from 'socket.io-client';
import { useEffect, useState} from 'react';
import './chatPage.scss';
import ScrollToBottom from 'react-scroll-to-bottom';



export const ChatPage = ({ onExit, token }) => {

    const newtoken = token;
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState({})
    const [usersOnline, setUsersOnline] = useState([])
    const [allUsers, setAllUsers] = useState([])



    const sendMessage = (data) => {
        if (data.message && data.message.length < 200) {
            socket.emit('message', data); 
        } 
    };

    const muteUser = (user, prevStatus) => {
        socket.emit('muteUser', {user, prevStatus} );
    }

    const banUser = (user, prevStatus) => {
        socket.emit('banUser', {user, prevStatus} );
    }


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

    useEffect(() => {
        if(socket){
            socket.on('connected', (data) => {
                setUser(data);
                }).on('error', (e) => {
                console.log(e)
            }); 
            socket.on('allmessages', (data) => {
                    setMessages(data)
                    }).on('error', (e) => {
                    console.log(e)
            }); 
            socket.on('usersOnline', (data) => {
                setUsersOnline(data)
                }).on('error', (e) => {
                console.log(e)
            });  
            socket.on('allDbUsers', (data) => {
                setAllUsers(data);
                }).on('error', (e) => {
                console.log(e)
            }); 
            socket.on('disconnect', (data) => {
                console.log( data, 'token');
                if(data == 'io server disconnect') {
                    localStorage.removeItem('token');
                    onExit();
                    
                } 
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


    // const messageWrapper = (messages) => {
    //     <ScrollToBottom >
    //          {
    //         messages.map((item) =>
    //             <div 
    //                 key={item._id}
    //                 className={ (item.userName == user.userName)? 
    //                 'message myMessage' :
    //                 'message'}>
    //                     <span>{item.userName}</span>
    //                     <p>{item.text}</p>  
    //                     <div>{item.createDate}</div>
    //             </div>

    //         )}

    //     </ScrollToBottom>
    // }

    return (
        <Container maxWidth="lg">
            <Box 
                sx={{
                    display: 'flex',
                    height: '100vh'
                }}>
                <Box
                sx={{
                    display: 'flex',
                    flexGrow:'2',
                    flexDirection: 'column',                    
                }}
                >
                    <Box                 
                    className='messageBox'
                    sx={{
                        display: 'flex',
                        flexGrow:'2',
                        flexDirection: 'column',
                        overflow: 'scroll',
                        height: '100vh'
                        
                    }}
>
{
                        messages.map((item) =>
                            <div 
                                key={item._id}
                                className={ (item.userName == user.userName)? 
                                'message myMessage' :
                                'message'}>
                                    <span>{item.userName}</span>
                                    <p>{item.text}</p>  
                                    <div>{item.createDate}</div>
                            </div>

                        )}

                        
                    </Box>
            
                        <MessageForm data = {user} sendMessage = {(data) => {
                            sendMessage(data)
                        }}></MessageForm>
                
                    </Box>
                    <Box
                        className='usersBox'
                         >
                        <Button 
                        sx={{
                            margin:'10px 5px'
                        }}
                        variant="outlined"
                        onClick={(e)=> {
                        socket.disconnect()
                        onExit()
                        }}>Logout</Button>

                            {user.isAdmin ? 
                            
                            allUsers.map((item) =>
                            <div 
                                key={item._id}
                                className='online'>
                            <div>{item.userName}</div>
                            <div>
                                <Button
                                variant="contained"
                                onClick={()=>{
                                    muteUser(item.userName, item.isMutted)
                                }}
                                sx={{
                                    margin:'3px',
                                    height: '25px'
                                }}>
                                    {item.isMutted? 'unmute': 'mute'}
                                </Button>
                                <Button
                                variant="contained"
                                onClick={()=>{
                                    banUser(item.userName, item.isBanned)
                                }}
                                sx={{
                                    margin:'3px',
                                    height: '25px'
                                }}>
                                    {item.isBanned? 'unban': 'ban'}
                                </Button>
                            </div>
                            {usersOnline.map( user =>{
                                if(item.userName == user.userName){
                                return <span style={{color: 'green'}}>online</span>
                            }}
                            )
                            }
                            </div>) 
                            :
                            usersOnline.map((item) =>
                            <div 
                                key={item._id}
                                className='online'>  
                            <div>{item.userName}</div>
                            <span style={{color: 'green'}}>online</span>
                            </div>)}
                </Box>
            </Box>
        </Container>
    )
}