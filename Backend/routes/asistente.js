const { json } = require('express')
const express = require('express')
const routes = express.Router()
const dbProxy = require('../dbProxy');
const subirImagenBase64 = require('../bucket');

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

routes.get('/solicitudes-empleo', (req, res) => {
    dbProxy.query(`
            SELECT
                e.codigo_empleado,
                u.username AS nombre_usuario, 
                u.nombre AS nombre_completo,
                mv.marca_nombre AS marca_vehiculo, 
                v.placa AS placa_vehiculo, 
                e.estado_cv AS estado_cv, 
                e.curriculum AS curriculum
            FROM 
                empleado e
            JOIN 
                usuario u ON e.usuario_id = u.usuario_id
            LEFT JOIN 
                vehiculo v ON e.vehiculo = v.vehiculo_id
            LEFT JOIN 
                marca_vehiculo mv ON v.marca = mv.marca_id;
        `, [], (err, results) => {
        if (err) {
            console.error('Error al obtener solicitudes de empleo:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
});

routes.post('/aprobar-solicitud-empleo', (req, res) => {
    const { usuario_id } = req.body;
    dbProxy.query('UPDATE empleado SET estado_cv = 1 WHERE usuario_id = ?;', [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al aprobar solicitud de empleo', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: '¡Contraseña cambiada!' });
    });
});

routes.post('/rechazar-solicitud-empleo', (req, res) => {
    const { usuario_id } = req.body;
    dbProxy.query('UPDATE empleado SET estado_cv = 0 WHERE usuario_id = ?;', [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al rechazar solicitud de empleo', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: '¡Contraseña cambiada!' });
    });
});

routes.get('/usuarios', (req, res) => {
    dbProxy.query(`
            SELECT 
                u.usuario_id, 
                u.nombre, 
                u.genero, 
                u.dpi, 
                u.celular, 
                u.edad, 
                u.fotografia, 
                u.direccion, 
                u.estado_cuenta, 
                u.estado_civil, 
                u.rol, 
                u.correo, 
                u.fecha_nacimiento, 
                u.username
            FROM 
                usuario u 
            WHERE 
                u.rol = 3;
        `, [], (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
});

routes.get('/conductores', (req, res) => {
    dbProxy.query(`
            SELECT 
                u.usuario_id, 
                u.nombre, 
                u.genero, 
                u.dpi, 
                u.celular, 
                u.edad, 
                u.fotografia, 
                u.direccion, 
                u.estado_cuenta, 
                u.estado_civil, 
                u.rol, 
                u.correo, 
                u.fecha_nacimiento, 
                u.username
            FROM 
                usuario u 
            WHERE 
                u.rol = 4;
        `, [], (err, results) => {
        if (err) {
            console.error('Error al obtener los conductores:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
});

routes.post('/baja-activar-cuenta', (req, res) => {
    const { usuario_id, nuevoEstado } = req.body;
    dbProxy.query('UPDATE usuario SET estado_cuenta = ? WHERE usuario_id = ?;', [nuevoEstado, usuario_id], (err, results) => {
        if (err) {
            console.error('Error al dar de baja o activar al conductor', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: '¡Contraseña cambiada!' });
    });
});

module.exports = routes