const { json } = require('express')
const express = require('express')
const routes = express.Router()
const subirImagenBase64 = require('../bucket');
const dbProxy = require('../dbProxy');

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

routes.get('/getUsuarios', (req, res) => {
    dbProxy.query('SELECT * FROM usuario', [], (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
});

routes.post('/registro', (req, res) => {
    const { nombre, fecha_nacimiento, genero, correo, celular, password } = req.body;
    username = generarNombreUsuario(nombre)
    dbProxy.query('INSERT INTO usuario (nombre, fecha_nacimiento, genero, correo, celular, password, rol, username) VALUES (?,?,?,?,?,?,3,?)', [nombre, fecha_nacimiento, genero, correo, celular, password, username], (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: '¡Usuario registrado!', username: username });
    });
});

function generarNombreUsuario(nombre) {
    const nombreLimpio = nombre.trim().toLowerCase();

    const partes = nombreLimpio.split(' ');

    if (partes.length < 2) {
        throw new Error('Debes proporcionar al menos un nombre y un apellido.');
    }

    // Si tiene más de un nombre, entonces el username se generará con los primeros dos nombres
    const parte1 = partes[0];
    const parte2 = partes[1];

    //Tomando los primeros tres caracteres
    const usernameParte1 = parte1.substring(0, 3);
    const usernameParte2 = parte2.substring(0, 3); 

    // Generar un número aleatorio de 3 cifras
    const numeroAleatorio = Math.floor(100 + Math.random() * 900); // Número entre 100 y 999

    const nombreUsuario = `${usernameParte1}${usernameParte2}${numeroAleatorio}`;

    return nombreUsuario;
}




module.exports = routes