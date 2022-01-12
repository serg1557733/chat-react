import './App.css';
import {io} from 'socket.io-client';
import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useEffect, useState } from 'react';


const SERVER_URL = 'http://localhost:5000';

const token = localStorage.getItem('token');

const socket = io.connect(SERVER_URL, {
          auth: {token}
        });
            socket.on('connected', (data) => {
                console.log( data.userName , 'connected to chat...');
                }).on('error', (e) => {
                console.log(e)
        });




//testing send messages
// const sendMessage = (data) => {
//     socket.emit("message", data);
//     console.log(`send `, socket)
// }
// sendMessage({
//     message: 'some 24334 message',
//     name: 'some name'
// });

function App() {

    
   
    return (

        (!!token) ?  <ChatPage/> : <LoginForm/>
    );
}

export default App;
