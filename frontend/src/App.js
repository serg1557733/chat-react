import './App.css';
import {io} from 'socket.io-client';
import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useEffect } from 'react';


const SERVER_URL = 'http://localhost:5000';


//const socket = io.connect(SERVER_URL);



// socket.on("connect", () => {
//     socket.on('chat_message', (data) => {
//         console.log(data); 
//     }); 
// });   
const token = localStorage.getItem('token');

const socket = io.connect(SERVER_URL, {
          auth: {token}
        });
        socket.on('connect', () => {
          console.log("Successfull Hand Shake");
        }).on('error', (e) => {
          console.log(e)
          });







//testing send messages
const sendMessage = (data) => {
    socket.emit("message", data);
    console.log(`send `)
}



sendMessage({
    message: 'some 24334 message',
    name: 'some name'
});



function App() {

    




    return (
        (!!token) ?  <ChatPage/> : <LoginForm/>
    );
}

export default App;
