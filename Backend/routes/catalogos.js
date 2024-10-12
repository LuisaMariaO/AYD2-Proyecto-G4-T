const { json } = require('express')
const express = require('express')
const routes = express.Router()
const dbProxy = require('../dbProxy');

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
    dbProxy.query('SELECT * FROM zonas;', [], (err, results) => {
        if (err) {
            console.error('Error al obtener zonas:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
   
})

routes.get('/estado_civil', (req, res) => {
  
            dbProxy.query('SELECT * FROM estado_civil;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"estado_civil":rows});
                }
            })
})

routes.get('/marcas', (req, res) => {

            dbProxy.query('SELECT * FROM marca_vehiculo;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"marcas":rows});
                }
            })
})

routes.get('/tarifas', (req, res) => {
  
            dbProxy.query('SELECT * FROM tarifa;', [], (err, rows) => {
                if (err) {
                    return res.status(200).json({ error: err });
                } else {
                    return res.status(200).json({"tarifas":rows});
                }
            })
})

routes.get('/motivos-bajas', (req, res) => {
  
    dbProxy.query('SELECT * FROM motivos_bajas;', [], (err, rows) => {
        if (err) {
            return res.status(200).json({ error: err });
        } else {
            return res.status(200).json({"motivos":rows});
        }
    })
})

routes.get('/destinos', (req, res) => {
    dbProxy.query('SELECT * FROM destino;', [], (err, results) => {
        if (err) {
            console.error('Error al obtener destinos:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
   
})

module.exports = routes