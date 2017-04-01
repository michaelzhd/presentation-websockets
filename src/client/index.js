import PaintCanvas from './PaintCanvas';
import io from 'socket.io-client';

// initialize paint canvas
const paintCanvas = new PaintCanvas();

// size the canavas to the window
paintCanvas.sizeCanvas({
  height: window.innerHeight,
  width: window.innerWidth,
});

// mount points
const paintContainerElem = document.getElementById('paint-container');
const controlsElem = document.getElementById('controls');

// mount
paintContainerElem.appendChild(paintCanvas.elem);
controlsElem.appendChild(paintCanvas.colorSelector.elem);
controlsElem.appendChild(paintCanvas.clearButton.elem);


const socket = io();

// subscribe to canvas events
paintCanvas.subscribe((action, data) => {
  socket.emit(action, {
    ...data,
  });
});

// listen for socket "DRAW_POINTS" events and draw the line
socket.on('DRAW_POINTS', ({points, color}) => {
  paintCanvas.drawLine(points, color);
});

// client username
const username = prompt('Enter your username');

// Emit "LOGIN" event to server
socket.on('connect', () => {
  socket.emit('LOGIN', {username});
});

// listen for "UPDATE_USER_LIST" events from server and update user list display
const usersElem = document.getElementById('users');
socket.on('UPDATE_USER_LIST', ({users}) => {
  const usernames = Object.keys(users).map(user => `<li>${user}</li>`);
  usersElem.innerHTML = usernames.join('');
});