const express = require('express');
const routes = express.Router();
const { subirImagenBase64, subirPDFBase64 } = require('../bucket'); // Para subir imágenes y PDFs a S3
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const crypto = require('crypto'); // Para generar la contraseña temporal
require('dotenv').config(); // Cargar variables de entorno
const bcrypt = require('bcrypt'); // 
const dbProxy = require('../dbProxy');
const { emitirViajeUsusario } = require('../socket');  // Función de WebSocket


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

        dbProxy.query(usuarioInsertQuery, [
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
            dbProxy.query(vehiculoInsertQuery, [
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
                dbProxy.query(empleadoInsertQuery, [urlCV, usuarioId, vehiculoId], async (err) => {
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


// Login
routes.post('/login', (req, res) => {
    const { identifier, password } = req.body;

    // Usar dbProxy para la conexión a la base de datos
    const query = `
        SELECT usuario.usuario_id, usuario.password, usuario.estado_cuenta, estado_cuenta.estado_descripcion
        FROM usuario 
        INNER JOIN estado_cuenta ON usuario.estado_cuenta = estado_cuenta.estado_cuenta_id 
        WHERE usuario.correo = ? OR usuario.dpi = ?
    `;

    dbProxy.query(query, [identifier, identifier], (err, rows) => {
        if (err || rows.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        const usuario = rows[0];

        if (usuario.estado_cuenta === 1) { // No activado
            return res.status(200).json({
                status: 'no_verificado',
                usuario_id: usuario.usuario_id
            });
        }

        // Comparar la contraseña
        bcrypt.compare(password, usuario.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(400).json({ status: 'error', message: 'Contraseña incorrecta' });
            }

            // Login exitoso
            return res.status(200).json({
                status: 'success',
                usuario_id: usuario.usuario_id
            });
        });
    });
});

// Actualizar contraseña
routes.post('/actualizarContrasena', async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateQuery = `
            UPDATE usuario 
            SET password = ?, estado_cuenta = 2 
            WHERE usuario_id = ?
        `; // Cambiar estado de cuenta a activado

        // Usar dbProxy para la conexión a la base de datos
        dbProxy.query(updateQuery, [hashedPassword, userId], (err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Error al actualizar' });
            }

            return res.status(200).json({ status: 'success', message: 'Contraseña actualizada correctamente' });
        });
    } catch (err) {
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// Nuevo endpoint: login solo con el código de trabajador
routes.post('/loginCodigo', (req, res) => {
    const { codigoTrabajador } = req.body;

    // Usar dbProxy para la conexión a la base de datos
    const query = `
        SELECT usuario.usuario_id, usuario.password, usuario.estado_cuenta
        FROM usuario 
        WHERE usuario.usuario_id = ?
    `;

    dbProxy.query(query, [codigoTrabajador], (err, rows) => {
        if (err || rows.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });
        }

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


routes.get('/categoriasProblema' , (req, res) => {
    dbProxy.query('SELECT * FROM categoria_problema', [], (err, results) => {
        if (err) {
            console.error('Error al obtener categorías de problema:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json(results);
    });
});

routes.post('/reportarProblema', async (req, res) => {
    const { descripcion, categoria, evidencia, viajeId } = req.body;

    if (!descripcion || !categoria || !viajeId || !evidencia) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos' });
    }

    try {
        // Subir el archivo de evidencia (PDF) como Base64
        const evidenciaUrl = await subirPDFBase64(evidencia, `evidencia_${viajeId}_${Date.now()}.pdf`, 'evidencias');

        // Consulta para insertar el problema en la tabla conductor_problema
        const insertProblemaQuery = `
            INSERT INTO conductor_problema (categoria, evidencia, viaje, descripcion) 
            VALUES (?, ?, ?, ?)
        `;

        // Ejecutar la consulta con los valores recibidos
        dbProxy.query(insertProblemaQuery, [categoria, evidenciaUrl, viajeId, descripcion], (err, result) => {
            if (err) {
                console.error('Error al insertar el problema:', err);
                return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
            }

            // Devolver éxito si se inserta correctamente
            return res.status(200).json({
                status: 'success',
                message: 'Problema reportado exitosamente',
                problema_id: result.insertId // ID del problema insertado
            });
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

routes.get('/viajesConductor/:conductorId', (req, res) => {
    const conductorId = req.params.conductorId;

    if (!conductorId) {
        return res.status(400).json({ status: 'error', message: 'ID de conductor no proporcionado' });
    }

    const query = `
        SELECT viaje.viaje_id, viaje.fecha, viaje.estado, tarifa.precio
        FROM viaje 
        INNER JOIN tarifa ON viaje.tarifa = tarifa.tarifa_id
        WHERE viaje.usuario_conductor = ?
        ORDER BY viaje.fecha DESC
    `;

    // Realizar la consulta para obtener los viajes del conductor
    dbProxy.query(query, [conductorId], (err, results) => {
        if (err) {
            console.error('Error al obtener los viajes del conductor:', err);
            return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No se encontraron viajes para este conductor' });
        }

        // Devolver los viajes al cliente
        return res.status(200).json({
            status: 'success',
            viajes: results // Lista de viajes del conductor
        });
    });
});

routes.get('/viajesDisponibles', async (req, res) => {
    try {
        const query = `
            SELECT v.viaje_id, v.fecha, v.metodo_pago, v.tarifa, v.usuario_solicitud, 
                   t.inicio, t.fin, t.precio, u.nombre AS usuario_nombre
            FROM viaje v
            INNER JOIN tarifa t ON v.tarifa = t.tarifa_id
            INNER JOIN usuario u ON v.usuario_solicitud = u.usuario_id
            WHERE v.estado = 1; -- Estado "Pendiente"
        `;

        dbProxy.query(query, [], (err, results) => {
            if (err) {
                console.error('Error al obtener viajes disponibles:', err);
                return res.status(500).json({ status: 'error', message: 'Error al obtener los viajes disponibles' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});



// Ruta para aceptar un viaje
routes.post('/aceptarViaje/:viajeId', async (req, res) => {
    const { viajeId } = req.params;
    const conductorId = req.body.conductorId; // Debes enviar el ID del conductor

    try {
        // Verifica si el viaje aún está pendiente
        const checkQuery = `
            SELECT estado
            FROM viaje
            WHERE viaje_id = ? AND estado = 1
        `;

        dbProxy.query(checkQuery, [viajeId], (err, result) => {
            if (err || result.length === 0) {
                return res.status(400).json({ status: 'error', message: 'El viaje ya ha sido aceptado por otro conductor.' });
            }

            // Si está pendiente, actualiza el estado a "En progreso" y asigna el conductor
            const updateQuery = `
                UPDATE viaje
                SET estado = 2, usuario_conductor = ?
                WHERE viaje_id = ?
            `;

            dbProxy.query(updateQuery, [conductorId, viajeId], (err) => {
                if (err) {
                    console.error('Error al aceptar el viaje:', err);
                    return res.status(500).json({ status: 'error', message: 'Error al aceptar el viaje.' });
                }

                dbProxy.query('SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, t.inicio, t.fin, t.precio, v.usuario_conductor,v.usuario_solicitud, u.nombre, vh.placa, vh.fotografia, ma.marca_nombre FROM viaje v LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa LEFT JOIN estado_viaje e ON v.estado=e.estado_id LEFT JOIN usuario u ON u.usuario_id = usuario_conductor LEFT JOIN empleado em ON em.usuario_id=usuario_conductor LEFT JOIN vehiculo vh ON vh.vehiculo_id=em.vehiculo LEFT JOIN marca_vehiculo ma ON ma.marca_id=vh.marca WHERE (estado = 1 OR estado = 2)', [], (err, viajes) => {
                    if (err) {
                        console.error('Error al consultar viajes:', err);
                        return res.status(500).json({ message: 'Error en el servidor' });
                    }
                    console.log('Viajes:', viajes);
                    // Emite la actualización al cliente con el estado de los viajes
                    emitirViajeUsusario(viajes);

                return res.status(200).json({ status: 'success', message: 'Viaje aceptado correctamente.' });
                });
            });


        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// Ruta para finalizar un viaje
routes.post('/finalizarViaje/:viajeId', async (req, res) => {
    const { viajeId } = req.params;
    const { conductorId, pagoRecibido, calificacion, comentarioManual, usuarioId } = req.body;

    try {
        // Actualizamos solo el estado del viaje a "completado"
        const updateQuery = `
            UPDATE viaje
            SET estado = 3 -- Estado "Completado"
            WHERE viaje_id = ? AND usuario_conductor = ?
        `;

        dbProxy.query(updateQuery, [viajeId, conductorId], (err, result) => {
            if (err) {
                console.error('Error en la actualización del viaje:', err);
                return res.status(500).json({ status: 'error', message: 'Error al finalizar el viaje.' });
            }

            // Verificar si se afectó alguna fila
            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'No se encontró el viaje o el conductor no coincide.' });
            }

            // Determinar el puntaje y comentario en función del pago
            const puntaje = pagoRecibido ? calificacion : 1; // Si no pagó, la calificación es 1
            const comentario = pagoRecibido ? comentarioManual || 'Sin comentario' : 'No realiza sus pagos';

            // Guardar la calificación del usuario por su ID
            const calificacionQuery = `
                INSERT INTO calificacion_usuario (puntaje, comentario, usuario_id)
                VALUES (?, ?, ?)
            `;
            dbProxy.query(calificacionQuery, [puntaje, comentario, usuarioId], (err) => {
                if (err) {
                    console.error('Error al guardar la calificación:', err);
                    return res.status(500).json({ status: 'error', message: 'Error al guardar la calificación.' });
                }

                return res.status(200).json({ status: 'success', message: 'Viaje finalizado y calificación registrada.' });
            });
        });
    } catch (error) {
        console.error('Error al finalizar el viaje:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});


routes.get('/informacionUsuario/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;

    console.log('Obtener información del usuario:', usuarioId);

    try {
        const query = `
            SELECT u.nombre, u.celular, 
                COALESCE(AVG(DISTINCT cu.puntaje), 0) AS calificacion_general,
                COUNT(DISTINCT v.viaje_id) AS viajes_completados,
                GROUP_CONCAT(DISTINCT CONCAT(cu.comentario, ' (Puntaje: ', cu.puntaje, ')') SEPARATOR '|') AS comentarios
            FROM usuario u
            LEFT JOIN viaje v ON u.usuario_id = v.usuario_solicitud
            LEFT JOIN calificacion_usuario cu ON cu.usuario_id = u.usuario_id
            WHERE u.usuario_id = ?
            GROUP BY u.usuario_id
        `;

        dbProxy.query(query, [usuarioId], (err, result) => {
            if (err || result.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No se encontró la información del usuario.' });
            }

            const usuarioData = result[0];

            // Si no hay comentarios, establecer como un array vacío
            const comentariosArray = usuarioData.comentarios
                ? usuarioData.comentarios.split('|').map(c => ({ comentario: c }))
                : [];

            return res.status(200).json({
                status: 'success',
                data: {
                    nombre: usuarioData.nombre,
                    celular: usuarioData.celular,
                    calificacion_general: usuarioData.calificacion_general || 0,
                    viajes_completados: usuarioData.viajes_completados || 0,
                    comentarios: comentariosArray
                }
            });
        });
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});


// Ruta para finalizar un viaje
routes.post('/finalizarViaje/:viajeId', async (req, res) => {
    const { viajeId } = req.params;
    const { conductorId, pagoRecibido, calificacion, comentarioManual } = req.body;

    try {
        // Primero, verificar si el viaje existe y pertenece al conductor
        const checkViajeQuery = `
            SELECT viaje_id FROM viaje WHERE viaje_id = ? AND usuario_conductor = ?
        `;
        dbProxy.query(checkViajeQuery, [viajeId, conductorId], (err, result) => {
            if (err) {
                console.error("Error al verificar el viaje:", err);
                return res.status(500).json({ status: 'error', message: 'Error interno al verificar el viaje.' });
            }

            if (result.length === 0) {
                return res.status(404).json({ status: 'error', message: 'El viaje no existe o no pertenece a este conductor.' });
            }

            // Actualizar el estado del viaje a "Completado"
            const updateQuery = `
                UPDATE viaje
                SET estado = 3, -- Estado "Completado"
                    fecha_finalizacion = NOW()
                WHERE viaje_id = ? AND usuario_conductor = ?
            `;
            dbProxy.query(updateQuery, [viajeId, conductorId], (err, result) => {
                if (err) {
                    console.error("Error al finalizar el viaje:", err);
                    return res.status(500).json({ status: 'error', message: 'Error al finalizar el viaje.' });
                }

                // Determinar el puntaje y comentario en función del pago recibido
                const puntaje = pagoRecibido ? calificacion : 1; // Si no pagó, la calificación es 1
                const comentario = pagoRecibido ? comentarioManual || 'Sin comentario' : 'No realiza sus pagos';

                // Insertar la calificación del usuario
                const calificacionQuery = `
                    INSERT INTO calificacion_usuario (puntaje, comentario, viaje)
                    VALUES (?, ?, ?)
                `;
                dbProxy.query(calificacionQuery, [puntaje, comentario, viajeId], (err) => {
                    if (err) {
                        console.error("Error al guardar la calificación:", err);
                        return res.status(500).json({ status: 'error', message: 'Error al guardar la calificación.' });
                    }

                    return res.status(200).json({ status: 'success', message: 'Viaje finalizado y calificación registrada.' });
                });
            });
        });
    } catch (error) {
        console.error('Error al finalizar el viaje:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});



// Ruta para cancelar un viaje
routes.post('/cancelarViaje/:viajeId', async (req, res) => {
    const { viajeId } = req.params;
    const { conductorId, motivo } = req.body;

    try {
        const updateQuery = `
            UPDATE viaje
            SET estado = 4 -- Estado "Cancelado"
            WHERE viaje_id = ? AND usuario_conductor = ?
        `;

        dbProxy.query(updateQuery, [viajeId, conductorId], (err, result) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Error al cancelar el viaje.' });
            }

            return res.status(200).json({ status: 'success', message: 'Viaje cancelado correctamente.' });
        });
    } catch (error) {
        console.error('Error al cancelar el viaje:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});



module.exports = routes;