import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import { Button, Container, TextField, Typography, List, ListItem, ListItemText, Stack } from "@mui/material";

function App() {
   const socket = useMemo(() => io("http://localhost:8080"), []);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State to hold all messages
  const [room, setRoom] = useState("");
  const [roomName, setroomName] = useState("")
  const [socketID, setSocketID] = useState("");

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  }

  const joinroomHandler = (e) => {
    e.preventDefault()
    socket.emit('join-room', roomName)
    setroomName("")

  }

  useEffect(() => {
    // Handling connection event
    socket.on('connect', () => {
      setSocketID(socket.id);
      console.log('Connected to server');
    });

    socket.on("received-message", (data) => {
      console.log('Received message:', data);
      setMessages((Messages) => [...Messages, data]); // Update messages state
    });

    // Handling disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Handling custom events
    socket.on('message', (data) => {
      console.log('Message received:', data);
    });

    socket.on('welcome', (s) => {
      console.log(s);
      // You can also update the UI with the received message here
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
      socket.off('welcome');
      socket.close();
    };
  }, [socket]);

  return (
    <Container maxWidth='sm'>
      <Typography variant="h1" fontSize={"30px"} component="div" gutterBottom>
        Welcome to socket.io
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinroomHandler}>
        <h5>Join room</h5>
        <TextField
          id="roomName"
          label="roomName"
          variant="outlined"
          value={roomName}
          onChange={(e) => setroomName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant='contained' type="submit" color="primary">join</Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          id="message"
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          id="room"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant='contained' type="submit" color="primary">Send</Button>
      </form>

      <Stack>

        {messages.map((m, i) => (
          <Typography variant="h6" key={i} component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

      {/* <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={`Message: ${msg.message}`} secondary={`Room: ${msg.room}`} />
          </ListItem>
        ))}
      </List> */}
    </Container>
  );
}

export default App;
