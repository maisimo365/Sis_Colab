const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    const username = `Usuario${Math.floor(Math.random() * 1000)}`;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    const userColor = colors[Math.floor(Math.random() * colors.length)];

    // Notificar entrada
    broadcast({
        type: 'system',
        message: `🎉 ${username} se ha unido al chat`,
        color: '#888'
    });

    ws.on('message', (message) => {
        // Enviar SOLO el mensaje al remitente
        ws.send(JSON.stringify({
            type: 'self',
            message: message.toString()
        }));
        
        // Enviar formato completo a los demás
        broadcast({
            type: 'chat',
            user: username,
            message: message.toString(),
            color: userColor
        }, ws); // Excluye al remitente
    });

    ws.on('close', () => {
        broadcast({
            type: 'system',
            message: `👋 ${username} ha salido del chat`,
            color: '#888'
        });
    });

    function broadcast(data, excludeWs = null) {
        wss.clients.forEach(client => {
            if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
});

console.log('🚀 Servidor activo en ws://localhost:8080');