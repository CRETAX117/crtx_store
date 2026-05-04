const socket = io();
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const container = document.getElementById('chatMessages');

// Nombre del usuario actual (lo toma del DOM)
const statusEl = document.querySelector('.chat-status strong');
const currentUser = statusEl ? statusEl.textContent : 'anon';

// Scroll al fondo
function scrollBottom() {
  container.scrollTop = container.scrollHeight;
}
scrollBottom();

// Enviar mensaje
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  socket.emit('chatMessage', {
    user: currentUser,
    message: text
  });
  input.value = '';
  input.focus();
});

// Recibir mensaje
socket.on('newMessage', (data) => {
  const div = document.createElement('div');
  div.className = 'chat-msg' + (data.user === currentUser ? ' chat-msg-own' : '');
  div.innerHTML = `
    <span class="chat-msg-user">${data.user}</span>
    <p class="chat-msg-text">${data.message}</p>
  `;
  container.appendChild(div);
  scrollBottom();
});
