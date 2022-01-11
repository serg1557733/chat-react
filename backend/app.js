
const express = require('express');
const app = express()
const cors = require("cors");
const http = require('http'); //create new http
const socket = require("socket.io");


const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"  //client endpoint and port
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());// cors 



//main page
app.get('/', (req, res) => {
  res.send('here will be login page')
})




//on connection listen messages and send back text and user name in chat
io.on("connection", (socket) => {
    socket.on("message", (data) => {
        console.log(data.message); 
        io.emit('chat_message',{
            message: data.message,
            name: data.name
        })
      });
      
  console.log(`user with ID :${socket.id} , connected to socket`); 
});





//server.listen(PORT);

server.listen(PORT, () => {
  console.log(`Server started. Port: ${PORT}`)
})
