const connect = require('express-myconnection');
const usuario = require('./routes/usuario');
const conductor = require('./routes/conductor');
const asistente = require('./routes/asistente');
const catalogos = require('./routes/catalogos');
const admin = require('./routes/admin');
const express = require('express');
const cors = require('cors');
const app = express();
const logger = require("morgan");
const dbProxy = require('./dbProxy');
const http = require('http');
const socketIO = require('./socket');
require('dotenv').config();

// ----------- PUERTO API -------------- 
app.set('port', process.env.PORT || 9000);

// Aumentar el límite de tamaño del cuerpo a 50 MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ----------- BASE DE DATOS ----------- 
dbProxy;

// ----------- MIDDLEWARES --------------
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// ------------ RUTAS ----------------------------
app.use('/usuario', usuario);
app.use('/conductor', conductor);
app.use('/asistente', asistente);
app.use('/admin', admin);
app.use('/catalogos', catalogos);

// ----------- INICIAR SERVIDOR DE API --------------
app.listen(app.get('port'), () => {
    console.log('Servidor API corriendo en el puerto: ', app.get('port'));
});

// ----------- SERVIDOR SOCKET.IO -------------- 
const socketApp = express();  // Un servidor Express separado para WebSocket
socketApp.use(cors())
const socketServer = http.createServer(socketApp);

// Inicializar el WebSocket en un puerto diferente (ej. 9001)
socketServer.listen(9001, () => {
    console.log('Servidor Socket.IO corriendo en el puerto: 9001');
});

socketIO.initSocket(socketServer);
