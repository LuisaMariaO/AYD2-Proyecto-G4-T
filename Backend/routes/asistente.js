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

routes.post('/sesion-asistente', (req, res) => {
    const { user, password } = req.body;

    dbProxy.query('SELECT * FROM usuario WHERE (username = ? OR correo = ?);', [user, user], (err, results) => {
        if (err) {
            return res.status(200).json({ message: 'Error en el servidor, por favor intente más tarde.' });
        }


        if (results.length === 0) {
            return res.status(200).json({ message: 'Usuario no encontrado', status: 0 }); // Usuario no existe
        } else if (results[0].estado_cuenta === 1) {
            return res.status(200).json({ message: 'Cuenta no verificada', status: 0 }); // Usuario no verificado
        }

        const user = results[0]; // Obtenemos el primer usuario

        if (user.password !== password) {
            return res.status(200).json({ message: 'Contraseña incorrecta', status: 0 });
        }

        if (user.rol !== 2) return res.status(200).json({ message: 'Ocurrió un error', status: 0 });

        // Si todo es correcto, responde con un mensaje de éxito
        res.status(200).json({ message: '¡Inicio de sesión exitoso!', username: user, status: 1 });
    });
});

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
        res.status(200).json({ message: 'Todo bien' });
    });
});

routes.post('/rechazar-solicitud-empleo', (req, res) => {
    const { usuario_id } = req.body;
    dbProxy.query('UPDATE empleado SET estado_cv = 0 WHERE usuario_id = ?;', [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al rechazar solicitud de empleo', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: 'Todo bien' });
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
        res.status(200).json({ message: 'Todo bien' });
    });
});

routes.post('/comentarios-puntuacion-usuario', (req, res) => {
    const { usuario_id } = req.body;
    dbProxy.query('SELECT * FROM calificacion_usuario WHERE usuario_id = ?;', [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener la información del conductor', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: 'Todo bien' });
    });
});

routes.post('/comentarios-puntuacion-conductor', (req, res) => {
    const { usuario_id } = req.body;
    console.log(usuario_id);
    dbProxy.query(`
            SELECT 
                u.username AS nombre_usuario,
                u.nombre AS nombre_completo,
                u.estado_cuenta AS estado_cuenta_id,
                ec.estado_descripcion AS estado_cuenta,
                v.viaje_id,
                v.fecha AS fecha_viaje,
                cc.puntaje AS calificacion,
                cc.comentario AS comentario_usuario
            FROM 
                usuario u
            JOIN 
                empleado e ON u.usuario_id = e.usuario_id
            JOIN 
                viaje v ON v.usuario_conductor = u.usuario_id
            LEFT JOIN 
                calificacion_conductor cc ON v.viaje_id = cc.viaje
            LEFT JOIN 
                estado_cuenta ec ON u.estado_cuenta = ec.estado_cuenta_id
            WHERE 
                u.usuario_id = ?;
        `, [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener la información del conductor', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: 'Todo bien' });
    });
});

routes.get('/obtener-ofertas', (req, res) => {
    dbProxy.query(`SELECT * FROM ofertas;`, [], (err, results) => {
        if (err) {
            console.error('Error al obtener las ofertas:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
});

routes.post('/crear-oferta', (req, res) => {
    const { descripcion, descuento, fecha_inicio, fecha_fin, estado } = req.body;
    const nuevaOferta = {
        descripcion,
        descuento,
        fecha_inicio,
        fecha_fin,
        estado: estado || 'ACTIVA'
    };
    dbProxy.query('INSERT INTO ofertas SET ?', nuevaOferta, (err, results) => {
        if (err) {
            console.error('Error al crear la oferta:', err);
            res.status(500).json({ error: 'Error al crear la oferta' });
            return;
        }
        // Devolver la oferta recién creada
        res.json({ id: results.insertId, ...nuevaOferta });
    });
});

routes.post('/editar-conductor/:id', (req, res) => {
    const conductorId = req.params.id;
    const { nombre, correo, celular, direccion, edad } = req.body;
    dbProxy.query('UPDATE usuario SET nombre = ?, correo = ?, celular = ?, direccion = ?, edad = ?  WHERE usuario_id = ?;', 
        [nombre, correo, celular, direccion, edad, conductorId], (err, results) => {
        if (err) {
            console.error('Error al actualizar los datos del conductor', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.status(200).json({ message: 'Todo bien' });
    });
});

module.exports = routes