const socket = new WebSocket('ws://localhost:8080'); //Conecta al servidor Websocket
const messagesDiv = document.getElementById('messages'); //Contenedor de mensajes
const input = document.getElementById('messageInput'); //Campo de texto
const sendButton = document.getElementById('sendButton'); //Boton de enviar

// Función para enviar mensajes
const sendMessage = () => {
    const message = input.value.trim(); //Elimina espacios
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(message); //Envia mensaje al servidor
        input.value = ''; //Limpia el input
    }
};

// Eventos al presionar "Enviar" o "Enter"
sendButton.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

// Manejar mensajes entrantes
socket.onmessage = (event) => {
    const data = JSON.parse(event.data); //Convierte el mensaje
    const msgElement = document.createElement('div');//Crea div para el mensaje
    // Verifica el tipo de mensaje recibido desde el servidor
    if (data.type === 'system') {
        msgElement.className = 'message system-message';
        msgElement.textContent = data.message;
    } 
    else if (data.type === 'self') {
        msgElement.className = 'message my-message'; // Se muestra alado derecho con otro estilo
        msgElement.textContent = data.message; // Solo contiene el txt del mensaje enviado
    } 
    else {
        msgElement.className = 'message user-message'; //Estilo para mensaje de otros
        msgElement.style.backgroundColor = data.color; //Aplica un color diferente por usuarios
        msgElement.textContent = `${data.user}: ${data.message}`; //Muestra el nombre del usuario y su mensaje
    }

    messagesDiv.appendChild(msgElement); //Agrega mensaje al DOM
    messagesDiv.scrollTop = messagesDiv.scrollHeight; //Baja al final del chat
};