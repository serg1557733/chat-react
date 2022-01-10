import './App.css';
import {io} from 'socket.io-client';



const SERVER_URL = 'http://localhost:5000';
const socket = io.connect(SERVER_URL);



//connecting with server and get back messages for chat
socket.on("connect", () => {
    socket.on('chat_message', (data) => {
        console.log(data); 
    }); 
});   



//testing send messages
const sendMessage = (data) => {
    socket.emit("message", data);
    console.log(`send `)
}



sendMessage({
    message: 'some message',
    name: 'some name'
});




function App() {
  return (
    <div className="App">
       <h1>working ...</h1>
    </div>
  );
}

export default App;
