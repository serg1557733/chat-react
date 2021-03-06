import { useEffect, useState, useMemo, useRef, Fragment} from 'react';
import { MessageForm } from './messageForm/MessageForm';
import {Button,Avatar, Box} from '@mui/material';
import { UserInfo } from './userInfo/UserInfo';
import { dateFormat } from './utils/dateFormat';
import {io} from 'socket.io-client';
import './chatPage.scss';
import { scrollToBottom } from './utils/scrollToBottom';
import { banUser } from './service/banUser';
import { muteUser } from './service/muteUser';
import {sendMessage} from './service/sendMessage';
import { store } from '../../store';


import { useSelector, useDispatch } from 'react-redux';



export const ChatPage = ({onExit}) => {
    
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState({})
    const [usersOnline, setUsersOnline] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const randomColor = require('randomcolor'); 
    const endMessages = useRef(null);

    

    const token = localStorage.getItem('token') || store.getState();

    const dispatch = useDispatch();




    console.log('ChatPage', token)

    useEffect(() => {
        if(token){
            
            try {
                setSocket(io.connect( 
                        process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', 
                        {auth: {token}})
                        )
            } catch (error) {
                console.log(error)
            } 
        }
    }, [token])

    useEffect(() => {

        if(socket){
            socket.on('connected', (data) => {
                setUser(data);
                }).on('error', (e) => {
                console.log('On connected', e)
            }); 
            socket.on('allmessages', (data) => {
                    setMessages(data)
                    }).on('error', (e) => {
                    console.log('allmessages', e)
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
                if(data === 'io server disconnect') {
                   socket.disconnect();
                   onExit(); 
                } 
                }).on('error', (e) => {
                console.log('error token', e)
            });  
            socket.on('message', (data) => {
                setMessages((messages) => [...messages, data] )
                }).on('error', (e) => {
                console.log(e)
            }); 
             
        }

        // return () => {
        //     socket.off('connected');
        //     socket.off('allmessages');
        // }
    }, [socket])

    useEffect(() => {
        scrollToBottom(endMessages)
      }, [messages]);

    let userColor = useMemo(() => randomColor(),[]);//color for myavatar

    return (
        <div className='rootContainer'>
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
                }}>
                    <Box className='messageBox'>                     
                        {
                        messages.map((item, i) =>
                        <Fragment key={i} >
                            <Avatar 
                                sx={
                                    (item.userName == user.userName)
                                    ? 
                                    {
                                        alignSelf: 'flex-end',
                                        fontSize: 10,
                                        width: '60px',
                                        height: '60px',
                                        color:'black',
                                        backgroundColor: userColor
                                    }
                                    :
                                    {
                                        backgroundColor:  (usersOnline.map(current =>{
                                            if(item.userName == current.userName ) {
                                                return current.color
                                            }
                                          
                                        } )),
                                        fontSize: 10,
                                        width: '60px',
                                        height: '60px',
                                        color:'black'
                                    }
                                    }> 
                                    {item.userName}
                            </Avatar>   
                            <div 
                                key={item._id}
                                className={ 
                                (item.userName == user.userName)
                                ? 
                                'message myMessage' 
                                :
                                'message'}
                                >
                                    <p>{item.text}</p>  
                                    <div
                                     style={{fontStyle:'italic',
                                            color: 'grey',
                                            fontSize: 14}}>
                                            {dateFormat(item).time}
                                    </div> 
                                    <div 
                                    style={{fontStyle:'italic',
                                            fontSize: 12,
                                            color: 'grey'}}>
                                            {dateFormat(item).year}
                                    </div>
                            </div>
                     
                        </Fragment>
                        )}
                        <div ref={endMessages}></div>
    
                        </Box>
                            <MessageForm 
                                    data = {user} 
                                    sendMessage = {(data) => {sendMessage(data, socket)}}>
                            </MessageForm>
                        </Box>

                        <Box
                        className='usersBox'
                        sx={{
                            overflow: 'scroll',  
                        }}>
                        <Button 
                                sx={{margin:'10px 5px'}}
                                variant="outlined"
                                onClick={(e)=> {
                                        socket.disconnect()
                                        //dispatch(removeToken(token))
                                        onExit()
                                        }}>
                                Logout
                        </Button>

                        <UserInfo 
                            data = {user.userName} 
                            color={userColor}/>
                            {
                                user.isAdmin 
                                ? 
                                allUsers.map((item) =>
                                <div 
                                    key={item._id}
                                    className='online'>
                                    <div style={
                                        {color: (usersOnline.map(current =>{
                                                if(item.userName == current.userName ) {
                                                    return current.color
                                                }
                                            
                                            }))}}>{item.userName}</div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={()=>{
                                                    muteUser(item.userName, item.isMutted, socket)
                                                    }}
                                                sx={{
                                                    margin:'3px',
                                                    height: '25px'
                                                }}>
                                                    {item.isMutted
                                                    ? 
                                                    'unmute'
                                                    : 'mute'}
                                            </Button>

                                            <Button
                                                variant="contained"
                                                onClick={()=>{
                                                    banUser(item.userName, item.isBanned, socket)
                                                }}
                                                sx={{
                                                    margin:'3px',
                                                    height: '25px'
                                                }}>
                                                    {item.isBanned
                                                ? 'unban'
                                                : 'ban'}
                                            </Button>

                                        </div>
                                {
                                usersOnline.map((user, i) =>{
                                                    if(item.userName == user.userName){
                                                    return <span key={i} style={{color: 'green'}}>online</span>
                                                    }
                                                })
                                }
                                </div>) 
                                :
                                usersOnline.map((item, i) =>
                                        <div 
                                            key={i}
                                            className='online'>  
                                            <div style={{color: item.color}}>
                                                {item.userName}
                                            </div>
                                            <span style={{color: 'green'}}>
                                                online
                                            </span>
                                        </div>)
                            }
                </Box>
            </Box>
        </div>
    )
}