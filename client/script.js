const socket = new WebSocket('ws://localhost:8080');
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Función para enviar mensajes
const sendMessage = () => {
    const message = input.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        input.value = '';
    }
};

// Eventos
sendButton.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

// Manejar mensajes entrantes
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const msgElement = document.createElement('div');

    if (data.type === 'system') {
        msgElement.className = 'message system-message';
        msgElement.textContent = data.message;
    } 
    else if (data.type === 'self') {
        msgElement.className = 'message my-message';
        msgElement.textContent = data.message;
    } 
    else {
        msgElement.className = 'message user-message';
        msgElement.style.backgroundColor = data.color;
        msgElement.textContent = `${data.user}: ${data.message}`;
    }

    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};