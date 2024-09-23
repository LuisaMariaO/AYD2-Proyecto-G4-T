const { json } = require('express')
const express = require('express')
const routes = express.Router()
const subirImagenBase64 = require('../bucket');

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

module.exports = routes