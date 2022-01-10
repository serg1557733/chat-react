import './App.css';
import {io} from 'socket.io-client';



const SERVER_URL = 'http://localhost:5000';

const socket = io.connect(SERVER_URL);

socket.on('connection', () => {
  console.log('connected')
});

socket.on('conected', () => {
  console.log('connected to server')
});


function App() {
  return (
    <div className="App">
       <h1>working ...</h1>
    </div>
  );
}

export default App;
