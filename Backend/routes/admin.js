const { json } = require('express')
const express = require('express')
const routes = express.Router()
const subirImagenBase64 = require('../bucket');

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

routes.post('/login', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            let query = `SELECT u.rol, u.usuario_id
                            FROM usuario u 
                            WHERE u.correo = ? and u.password = ?;`
            connect.query(query, [req.body.usuario, req.body.password], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"success":true, "res":rows});
                }
            })
        }
    })
})

routes.post('/auth', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            let query = `SELECT u.rol, u.usuario_id 
                            FROM usuario u 
                            WHERE u.auth2 = ? and u.usuario_id = ?;`
            connect.query(query, [req.body.auth, req.body.id], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"success":true, "res":rows});
                }
            })
        }
    })
})

routes.get('/obtenerInformacion', (req, res) => {
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
})

module.exports = routes