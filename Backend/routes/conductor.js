const express = require('express');
const routes = express.Router();
const { subirImagenBase64, subirPDFBase64 } = require('../bucket'); // Para subir imágenes y PDFs a S3
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const crypto = require('crypto'); // Para generar la contraseña temporal
require('dotenv').config(); // Cargar variables de entorno
const bcrypt = require('bcrypt'); // 


// Configuración del transporte para enviar correos electrónicos usando variables de entorno
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // Servicio de correo, ej. Gmail
    auth: {
        user: process.env.EMAIL_USER, // Correo electrónico desde el cual se enviarán los correos
        pass: process.env.EMAIL_PASS  // Contraseña del correo electrónico
    }
});

routes.post('/registro', async (req, res) => {
    const {
        nombreCompleto,
        numeroTelefono,
        edad,
        numeroDpi,
        correo,
        cv, // Base64
        fotografia, // Base64
        fotoVehiculo, // Base64
        numeroPlaca,
        marcaVehiculo, // Este ya es el ID de la marca recibido del frontend
        anioVehiculo,
        genero,
        estadoCivil, // Este ya es el ID del estado civil recibido del frontend
        direccionDomicilio
    } = req.body;

    console.log("Datos recibidos en la solicitud:", req.body); // Verifica que los datos están llegando correctamente

    req.getConnection(async (err, connect) => {
        if (err) {
            console.error("Error de conexión con la base de datos:", err); // Log del error de conexión
            return res.status(404).json({
                status: false,
                error: "Error de conexión con la base de datos"
            });
        }

        try {
            // Subir la imagen del conductor, la imagen del vehículo y el CV a S3 en paralelo
            const [urlFotoConductor, urlFotoVehiculo, urlCV] = await Promise.all([
                subirImagenBase64(fotografia, `foto_conductor_${nombreCompleto}_${Date.now()}.jpg`, 'conductores'),
                subirImagenBase64(fotoVehiculo, `foto_vehiculo_${numeroPlaca}_${Date.now()}.jpg`, 'vehiculos'),
                subirPDFBase64(cv, `cv_${nombreCompleto}_${Date.now()}.pdf`, 'cv')
            ]);

            console.log("Imagen del conductor subida a S3:", urlFotoConductor);
            console.log("Imagen del vehículo subida a S3:", urlFotoVehiculo);
            console.log("CV subido a S3:", urlCV);

            // Generar una contraseña temporal
            const passwordTemporal = crypto.randomBytes(4).toString('hex'); // 8 caracteres aleatorios
            const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

            console.log("Contraseña temporal generada:", passwordTemporal);

            // Insertar en la tabla usuario
            const usuarioInsertQuery = `
                INSERT INTO usuario (nombre, genero, dpi, celular, edad, fotografia, direccion, password, estado_cuenta, estado_civil, rol, correo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            console.log("Insertando datos del usuario en la base de datos...");

            connect.query(usuarioInsertQuery, [
                nombreCompleto,
                genero,
                numeroDpi,
                numeroTelefono,
                edad,
                urlFotoConductor,
                direccionDomicilio,
                hashedPassword,  // Contraseña temporal encriptada
                1, // Estado de cuenta por defecto: 1 (No activado)
                estadoCivil, // Relación con estado civil
                4, // Rol de conductor (ID 4 en la tabla rol)
                correo
            ], (err, usuarioResult) => {
                if (err) {
                    console.error("Error al insertar usuario:", err);
                    return res.status(500).json({ status: false, message: 'Error al insertar usuario', error: err });
                }

                const usuarioId = usuarioResult.insertId; // Obtener el ID de usuario registrado
                console.log("Usuario insertado con ID:", usuarioId);

                // Insertar en la tabla vehiculo
                const vehiculoInsertQuery = `
                    INSERT INTO vehiculo (fotografia, placa, anio, marca)
                    VALUES (?, ?, ?, ?)
                `;
                console.log("Insertando datos del vehículo...");
                connect.query(vehiculoInsertQuery, [
                    urlFotoVehiculo,
                    numeroPlaca,
                    anioVehiculo,
                    marcaVehiculo
                ], (err, vehiculoResult) => {
                    if (err) {
                        console.error("Error al insertar vehículo:", err);
                        return res.status(500).json({ status: false, message: 'Error al insertar vehículo', error: err });
                    }

                    const vehiculoId = vehiculoResult.insertId;
                    console.log("Vehículo insertado con ID:", vehiculoId);

                    // Insertar en la tabla empleado
                    const empleadoInsertQuery = `
                        INSERT INTO empleado (curriculum, usuario_id, vehiculo)
                        VALUES (?, ?, ?)
                    `;
                    console.log("Insertando datos del empleado...");
                    connect.query(empleadoInsertQuery, [urlCV, usuarioId, vehiculoId], async (err) => {
                        if (err) {
                            console.error("Error al insertar empleado:", err);
                            return res.status(500).json({ status: false, message: 'Error al insertar empleado', error: err });
                        }

                        // Enviar correo con la contraseña temporal y el código de trabajador (usuarioId)
                        const mailOptions = {
                            from: process.env.EMAIL_USER, // Usar el correo configurado en el .env
                            to: correo,
                            subject: 'Contraseña Temporal y Código de Trabajador',
                            text: `Hola ${nombreCompleto},\n\nTu código de trabajador es: ${usuarioId}\nTu contraseña temporal para iniciar sesión es: ${passwordTemporal}\n\nPor favor, inicia sesión y cambia tu contraseña.\n\nGracias.`
                        };

                        console.log("Enviando correo electrónico...");
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.error("Error al enviar el correo electrónico:", err);
                                return res.status(500).json({ status: false, message: 'Error al enviar el correo', error: err });
                            }

                            console.log("Correo enviado:", info);
                            return res.status(200).json({
                                status: true,
                                message: 'Conductor registrado exitosamente y correo enviado'
                            });
                        });
                    });
                });
            });
        } catch (error) {
            console.error('Error en el bloque try-catch:', error);
            return res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
            });
        }
    });
});

// Login
routes.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    req.getConnection((err, connect) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Error de conexión' });

        const query = `
            SELECT usuario.usuario_id, usuario.password, usuario.estado_cuenta, estado_cuenta.estado_descripcion
            FROM usuario 
            INNER JOIN estado_cuenta ON usuario.estado_cuenta = estado_cuenta.estado_cuenta_id 
            WHERE usuario.correo = ? OR usuario.dpi = ?
        `;
        connect.query(query, [identifier, identifier], (err, rows) => {
            if (err || rows.length === 0) return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });

            const usuario = rows[0];

            if (usuario.estado_cuenta === 1) { // No activado
                return res.status(200).json({
                    status: 'no_verificado',
                    usuario_id: usuario.usuario_id
                });
            }

            bcrypt.compare(password, usuario.password, (err, isMatch) => {
                if (err || !isMatch) return res.status(400).json({ status: 'error', message: 'Contraseña incorrecta' });

                return res.status(200).json({
                    status: 'success',
                    usuario_id: usuario.usuario_id
                });
            });
        });
    });
});

// Actualizar contraseña
routes.post('/actualizarContrasena', (req, res) => {
    const { userId, newPassword } = req.body;

    req.getConnection(async (err, connect) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Error de conexión' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateQuery = `
            UPDATE usuario 
            SET password = ?, estado_cuenta = 2 
            WHERE usuario_id = ?
        `; // Cambiar estado de cuenta a activado

        connect.query(updateQuery, [hashedPassword, userId], (err) => {
            if (err) return res.status(500).json({ status: 'error', message: 'Error al actualizar' });

            return res.status(200).json({ status: 'success', message: 'Contraseña actualizada correctamente' });
        });
    });
});

// Nuevo endpoint: login solo con el código de trabajador
routes.post('/loginCodigo', (req, res) => {
    const { codigoTrabajador } = req.body;

    req.getConnection((err, connect) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Error de conexión' });

        const query = `
            SELECT usuario.usuario_id, usuario.password, usuario.estado_cuenta
            FROM usuario 
            WHERE usuario.usuario_id = ?
        `;
        connect.query(query, [codigoTrabajador], (err, rows) => {
            if (err || rows.length === 0) return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });

            const usuario = rows[0];

            if (usuario.estado_cuenta === 1) { // No activado
                return res.status(200).json({
                    status: 'no_verificado',
                    usuario_id: usuario.usuario_id
                });
            }

            // Si está verificado, simplemente retorna éxito
            return res.status(200).json({
                status: 'success',
                usuario_id: usuario.usuario_id
            });
        });
    });
});

module.exports = routes;