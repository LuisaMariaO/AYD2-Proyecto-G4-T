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


module.exports = routes