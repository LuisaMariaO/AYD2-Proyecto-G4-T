const express = require('express')
const routes = express.Router()
const { subirImagenBase64, subirPDFBase64 } = require('../bucket');
const dbProxy = require('../dbProxy');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

routes.post('/login', (req, res) => {

    let query = `SELECT u.rol, u.usuario_id
                    FROM usuario u 
                    WHERE u.correo = ? and u.password = ?;`
    dbProxy.query(query, [req.body.usuario, req.body.password], (err, results) => {
        if (err) {
            return res.status(200).json({ error: err });
        }
        return res.status(200).json({ "success": true, "res": results });
    });
});

routes.post('/auth', (req, res) => {
    let query = `SELECT u.rol, u.usuario_id 
                            FROM usuario u 
                            WHERE u.auth2 = ? and u.usuario_id = ?;`
    dbProxy.query(query, [req.body.auth, req.body.id], (err, results) => {
        if (err) {
            return res.status(200).json({ error: err });
        }
        return res.status(200).json({ "success": true, "res": results });
    });

});


/*routes.get('/obtenerInformacion', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            let query = `SELECT u.usuario_id, u.nombre, u.genero, u.celular, u.edad, u.fotografia,
                            ec.nombre_estado_civil, r.nombre_rol 
                            FROM usuario u
                            LEFT JOIN estado_civil ec ON ec.estado_civil_id = u.estado_civil
                            LEFT JOIN rol r ON r.rol_id = u.rol 
                            WHERE u.usuario_id = ?;`
            connect.query(query, [req.query.id], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"success":true, "res":rows});
                }
            })
        }
    })
})*/

routes.post('/create-assistant', async (req, res) => {
    const {
        nombre,
        genero,
        celular,
        edad,
        fotografia,
        direccion,
        estado_civil,
        correo,
        dpi,
        fecha_nacimiento,
        username,
        cv
    } = req.body;

    try {
        const [urlFotoConductor, urlCV] = await Promise.all([
            subirImagenBase64(fotografia, `foto_asistente_${nombre}_${Date.now()}.jpg`, 'asistentes'),
            subirPDFBase64(cv, `cv_${nombre}_${Date.now()}.pdf`, 'cv')
        ]);

        const passwordTemporal = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

        let query_usuario = `INSERT INTO usuario 
                    (nombre, genero, celular, edad,
                    fotografia, direccion, estado_cuenta, password,
                    estado_civil, rol, correo, dpi,
                    fecha_nacimiento, username)
                    VALUES (
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?);`;
                    
        dbProxy.query(query_usuario,
            [
                nombre,
                genero,
                celular,
                edad,
                urlFotoConductor,
                direccion,
                2,
                hashedPassword,
                estado_civil,
                2,
                correo,
                dpi,
                fecha_nacimiento,
                username
            ], (err, results) => {

                if (err) {
                    return res.status(200).json({ error: err });
                }

                let usuario_id = results.insertId;
                if (usuario_id) {
                    let query_empleado = `INSERT INTO empleado 
                                    ( curriculum, usuario_id )
                                    VALUES ( ?, ? );`
                    dbProxy.query(query_empleado,
                        [
                            urlCV,
                            usuario_id
                        ], (err, results) => {
                            if (err) {
                                return res.status(200).json({ error: err });
                            }
                            return res.status(200).json({ "success": true, "res": results });
                        })
                } else {
                    return res.status(200).json({ error: err });
                }
            });
    } catch (error) {
        console.error('Error en el bloque try-catch:', error);
        return res.status(500).json({
            status: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = routes