import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

socket.on('message', (msg) => {
  console.log('message', msg)
});

export const sendMessage = (msg:string) =>{
  console.log('sending message', msg);
}

