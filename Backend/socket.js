const socketIO = require('socket.io');
let io;

function initSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000", // Permite el acceso desde tu frontend React
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado:', socket.id);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
}

// Función para emitir los viajes en estado pendiente
function emitirActualizacionViajes(viajes) {
    if (io) {
        io.emit('actualizacionViajes', viajes);  
    }
}

function emitirViajeUsusario(viajes) {
    if (io) {
        io.emit('actualizacionViajesUsusario', viajes);  // Emite todos los viajes pendientes a todos los clientes conectados
    }
}

function emitirViajesConductores(viajes) {
    if (io) {
        io.emit('actualizacionViajesDisponibles', viajes);  // Emite todos los viajes pendientes a todos los clientes conectados
    }
}

function emitirViajeId(viaje) {
    if (io) {
        io.emit('viajeFinalizado', viaje);  // Emite todos los viajes pendientes a todos los clientes conectados
    }
}

module.exports = {
    initSocket,
    emitirActualizacionViajes,
    emitirViajeUsusario,
    emitirViajesConductores,
    emitirViajeId
};
