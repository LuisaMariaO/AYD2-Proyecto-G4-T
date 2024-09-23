const { json } = require('express')
const express = require('express')
const routes = express.Router()

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

routes.get('/problemas', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            connect.query('SELECT * FROM categoria_problema;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"problemas":rows});
                }
            })
        }
    })
})

routes.get('/zonas', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            connect.query('SELECT * FROM zonas;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"zonas":rows});
                }
            })
        }
    })
})

routes.get('/estado_civil', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            connect.query('SELECT * FROM estado_civil;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"estado_civil":rows});
                }
            })
        }
    })
})

routes.get('/marcas', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            connect.query('SELECT * FROM marca_vehiculo;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"marcas":rows});
                }
            })
        }
    })
})

routes.get('/tarifas', (req, res) => {
    req.getConnection((err, connect) => {
        if (err) {
            return res.status(404).json({
                "status": false,
                error: "error de conexión con la base de datos"
            });
        } else {
            connect.query('SELECT * FROM tarifa;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"tarifas":rows});
                }
            })
        }
    })
})

module.exports = routes