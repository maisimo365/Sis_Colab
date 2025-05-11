// Importa el modulo "ws" para el webSocket
const WebSocket = require('ws');
// Crea un servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });
// Evento que se ejecuta cuando un nuevo cliente se conecta
wss.on('connection', (ws) => {
    // Generar un nombre de usuario aleatorio
    const username = `Usuario${Math.floor(Math.random() * 1000)}`;
    // Colores disponibles: Rojo, Turquesa, Azul, Naranja Claro
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    // Selecciona un color aleatorio para el usuario
    const userColor = colors[Math.floor(Math.random() * colors.length)];

    // Notifica la entrada de un usuario
    broadcast({
        type: 'system',
        // Mensaje de notificación
        message: `🎉 ${username} se ha unido al chat`,
        // El mensaje es de color gris
        color: '#888'
    });
    // Evento que se ejecuta cuando se envia mensaje al chat
    ws.on('message', (message) => {
        // Envio de mensaje al chat
        ws.send(JSON.stringify({
            type: 'self',
            message: message.toString()
        }));
        
        // Esta parte del codigo se encarga de enviar el mensaje indicando el usuario
        broadcast({
            type: 'chat',
            user: username,
            message: message.toString(),
            color: userColor
        }, ws); // Excluye al que envió el mensaje
    });
    // Evento donde se ejecuta cuando alguien del chat se desconecta
    ws.on('close', () => {
        // Informa al chat si un usuario se desconecta
        broadcast({
            type: 'system',
            message: `👋 ${username} ha salido del chat`,
            // El mensaje es de color gris
            color: '#888'
        });
    });
    // Función que envía datos a todos los clientes conectados
    // excepto al cliente que se pasa como 'excludeWs' (opcional)
    function broadcast(data, excludeWs = null) {
        wss.clients.forEach(client => {
            // Verifica que el cliente esté conectado y no sea el excluido
            if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
});
// Mensaje en consola para verificar actividad
console.log('🚀 Servidor activo en ws://localhost:8080');