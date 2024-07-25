const express = require("express")
const { createServer } = require('node:http');
const { Server, Socket } = require('socket.io');
const cors = require("cors")



const app = express()

const port = 8080
 
const server = createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials: true
  }
});

app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST"],
  credentials: true
}))

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });




  io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    console.log("Id",socket.id)
     socket.emit("welcome",`${socket.id},joined the server`)

    socket.on("message",({room,message})=>{
      console.log({room,message});

       socket.to(room).emit("received-message",message)
    })

    socket.on("join-room",(room)=>{
     socket.join(room)
     console.log(`User joined room ${room}`);
    })
  });
  



server.listen(port,()=>{
    console.log(`server running at port ${port}`);
})