const connect = require('express-myconnection')
const usuario = require('./routes/usuario')
const conductor = require('./routes/conductor')
const asistente = require('./routes/asistente')
const admin = require('./routes/admin')
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const app = express()
const logger = require("morgan")

require('dotenv').config();

// ----------- PUERTO -------------- 
app.set('port', process.env.PORT || 9000)

// ----------- BASE DE DATOS -----------
const DBconfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

app.use(cors())
app.use(connect(mysql, DBconfig, 'single'))
app.use(express.json())
app.use(logger("dev"))

// ------------ RUTAS ----------------------------
app.use('/usuario', usuario)
app.use('/conductor', conductor)
app.use('/asistente', asistente)
app.use('/admin', admin)

// ----------- SERVIDOR CORRIENDO -------------- 
app.listen(app.get('port'), ()=>{
    console.log('Servidor corriendo en el puerto: ', app.get('port'))
});