import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('message', (msg) => {
  console.log('message', msg);
});

export const sendMessage = (msg: string) => {
  console.log('sending message', msg);
};
