import './App.css';
import { LoginForm } from './components/loginForm/LoginForm';
import { ChatPage } from './components/chatPage/ChatPage';
import { useEffect, useState } from 'react';




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

    const [token, setToken] = useState(localStorage.getItem('token'))

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token])


    if (token) {
        return <ChatPage token={token} onExit={() => setToken('')}/> 
    }

    return <LoginForm onSubmit={setToken}/>; // delete setTokek after unmounted

}

export default App;
