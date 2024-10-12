const express = require('express');
const routes = express.Router();
const { subirImagenBase64, subirPDFBase64 } = require('../bucket'); // Para subir imágenes y PDFs a S3
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const crypto = require('crypto'); // Para generar la contraseña temporal
require('dotenv').config(); // Cargar variables de entorno
const bcrypt = require('bcrypt'); // 
const dbProxy = require('../dbProxy');
const { emitirViajeUsusario, emitirViajeId } = require('../socket');  // Función de WebSocket
const util = require('util');
const query = util.promisify(dbProxy.query).bind(dbProxy);


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


routes.get('/categoriasProblema', (req, res) => {
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

        const viajePendiente = await query(checkQuery, [viajeId]);

        if (viajePendiente.length === 0) {
            return res.status(400).json({ status: 'error', message: 'El viaje ya ha sido aceptado por otro conductor.' });
        }

        // Si está pendiente, actualiza el estado a "En progreso" y asigna el conductor
        const updateQuery = `
            UPDATE viaje
            SET estado = 2, usuario_conductor = ?
            WHERE viaje_id = ?
        `;

        await query(updateQuery, [conductorId, viajeId]);

        // Selecciona los viajes actualizados
        const selectViajesQuery = `
            SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, 
                   t.inicio, t.fin, t.precio, v.usuario_conductor, v.usuario_solicitud, 
                   u.nombre, vh.placa, vh.fotografia, ma.marca_nombre 
            FROM viaje v 
            LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa 
            LEFT JOIN estado_viaje e ON v.estado = e.estado_id 
            LEFT JOIN usuario u ON u.usuario_id = usuario_conductor 
            LEFT JOIN empleado em ON em.usuario_id = usuario_conductor 
            LEFT JOIN vehiculo vh ON vh.vehiculo_id = em.vehiculo 
            LEFT JOIN marca_vehiculo ma ON ma.marca_id = vh.marca 
            WHERE (v.estado = 1 OR v.estado = 2)
        `;

        const viajes = await query(selectViajesQuery, []);

        // Emite la actualización al cliente con el estado de los viajes
        emitirViajeUsusario(viajes);

        return res.status(200).json({ status: 'success', message: 'Viaje aceptado correctamente.' });

    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
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

        const updateResult = await query(updateQuery, [viajeId, conductorId]);

        // Verificar si se afectó alguna fila
        if (updateResult.affectedRows === 0) {
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

        await query(calificacionQuery, [puntaje, comentario, usuarioId]);

        // Consultar los viajes en estado 1 o 2
        const selectViajesQuery = `
            SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, 
                   t.inicio, t.fin, t.precio, v.usuario_conductor, v.usuario_solicitud, 
                   u.nombre, vh.placa, vh.fotografia, ma.marca_nombre 
            FROM viaje v 
            LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa 
            LEFT JOIN estado_viaje e ON v.estado = e.estado_id 
            LEFT JOIN usuario u ON u.usuario_id = usuario_conductor 
            LEFT JOIN empleado em ON em.usuario_id = usuario_conductor 
            LEFT JOIN vehiculo vh ON vh.vehiculo_id = em.vehiculo 
            LEFT JOIN marca_vehiculo ma ON ma.marca_id = vh.marca 
            WHERE (v.estado = 1 OR v.estado = 2)
        `;

        const viajes = await query(selectViajesQuery, []);

        // Emite la actualización al cliente con el estado de los viajes
        emitirViajeUsusario(viajes);
        emitirViajeId({viajeId: viajeId});

        return res.status(200).json({ status: 'success', message: 'Viaje finalizado y calificación registrada.' });

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

        // Primero se hace el update
        const updateResult = await query(updateQuery, [viajeId, conductorId]);

        if (updateResult.affectedRows === 0) {
            return res.status(400).json({ status: 'error', message: 'El viaje no existe o ya fue cancelado por otro conductor.' });
        }

        // Después de cancelar el viaje, consulta los viajes en estado 1 o 2
        const selectViajesQuery = `
            SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, 
                   t.inicio, t.fin, t.precio, v.usuario_conductor, v.usuario_solicitud, 
                   u.nombre, vh.placa, vh.fotografia, ma.marca_nombre 
            FROM viaje v 
            LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa 
            LEFT JOIN estado_viaje e ON v.estado = e.estado_id 
            LEFT JOIN usuario u ON u.usuario_id = usuario_conductor 
            LEFT JOIN empleado em ON em.usuario_id = usuario_conductor 
            LEFT JOIN vehiculo vh ON vh.vehiculo_id = em.vehiculo 
            LEFT JOIN marca_vehiculo ma ON ma.marca_id = vh.marca 
            WHERE (v.estado = 1 OR v.estado = 2)
        `;

        const viajes = await query(selectViajesQuery, []);

        // Emite la actualización al cliente con el estado de los viajes
        emitirViajeUsusario(viajes);

        return res.status(200).json({ status: 'success', message: 'Viaje cancelado correctamente.' });

    } catch (error) {
        console.error('Error al cancelar el viaje:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});

// Endpoint para obtener las ganancias de un conductor
routes.post('/ganancias', (req, res) => {
    const { conductorId } = req.body;

    if (!conductorId) {
        return res.status(400).json({ status: 'error', message: 'El ID del conductor es requerido.' });
    }

    // Consulta para obtener los viajes completados (estado 3 = Completado)
    const query = `
        SELECT v.viaje_id, v.fecha, t.precio, v.metodo_pago 
        FROM viaje v
        INNER JOIN tarifa t ON v.tarifa = t.tarifa_id
        WHERE v.usuario_conductor = ? AND v.estado = 3`; // Estado 3 = Viaje completado

    dbProxy.query(query, [conductorId], (err, results) => {
        if (err) {
            console.error('Error al obtener las ganancias:', err);
            return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
        }

        const hoy = new Date();
        
        // Establecer horas a 00:00:00 para la comparación de fechas
        const inicioHoy = new Date(hoy.setHours(0, 0, 0, 0));

        // Calcular el inicio de la semana (desde el domingo anterior o actual)
        const inicioSemana = new Date(inicioHoy);
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());

        // Calcular el inicio del mes (primer día del mes actual)
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        let gananciasDiarias = 0;
        let gananciasSemanales = 0;
        let gananciasMensuales = 0;

        results.forEach(viaje => {
            const fechaViaje = new Date(viaje.fecha);
            const fechaViajeCeroHoras = new Date(fechaViaje.setHours(0, 0, 0, 0)); // Para comparar solo fechas

            // Ganancias diarias (viajes realizados hoy)
            if (fechaViajeCeroHoras.getTime() === inicioHoy.getTime()) {
                gananciasDiarias += viaje.precio * 0.9;
            }
            // Ganancias semanales (viajes desde el inicio de la semana)
            if (fechaViajeCeroHoras >= inicioSemana) {
                gananciasSemanales += viaje.precio * 0.9;
            }
            // Ganancias mensuales (viajes desde el inicio del mes)
            if (fechaViajeCeroHoras >= inicioMes) {
                gananciasMensuales += viaje.precio * 0.9;
            }
        });

        res.json({
            status: 'success',
            gananciasDiarias: gananciasDiarias.toFixed(2),
            gananciasSemanales: gananciasSemanales.toFixed(2),
            gananciasMensuales: gananciasMensuales.toFixed(2),
            viajes: results
        });
    });
});

routes.post('/perfil', (req, res) => {
    const { conductorId } = req.body; // El conductorId se envía en el cuerpo de la solicitud

    if (!conductorId) {
        return res.status(400).json({ status: 'error', message: 'El ID del conductor es requerido.' });
    }

    const query = `
        SELECT u.nombre, u.direccion, u.celular, u.correo, v.placa, v.anio, mv.marca_nombre AS marca
        FROM usuario u
        INNER JOIN empleado e ON u.usuario_id = e.usuario_id
        INNER JOIN vehiculo v ON e.vehiculo = v.vehiculo_id
        INNER JOIN marca_vehiculo mv ON v.marca = mv.marca_id
        WHERE u.usuario_id = ?`;

    dbProxy.query(query, [conductorId], (err, results) => {
        if (err) {
            console.error('Error al obtener la información del conductor:', err);
            return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Conductor no encontrado.' });
        }
        res.json({ status: 'success', conductor: results[0] });
    });
});


// Endpoint para obtener las marcas de vehículos
routes.get('/marcas', (req, res) => {
    const query = `SELECT marca_id, marca_nombre FROM marca_vehiculo`;

    dbProxy.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las marcas de vehículos:', err);
            return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
        }
        res.json({ status: 'success', marcas: results });
    });
});

// Ruta para actualizar el perfil del conductor y la información del vehículo
routes.post('/perfil/update', (req, res) => {
    const { conductorId, data } = req.body;
    const { nombre, direccion, celular, correo, placa, marca, anio, pdfActualizacion } = data;

    // Iniciar la transacción
    dbProxy.beginTransaction((err) => {
        if (err) {
            console.error('Error iniciando la transacción:', err);
            return res.status(500).json({ status: 'error', message: 'Error iniciando la transacción.' });
        }

        // Actualizar la información del usuario (conductor)
        const updateUsuarioQuery = `
            UPDATE usuario 
            SET nombre = ?, direccion = ?, celular = ?, correo = ? 
            WHERE usuario_id = ?
        `;
        dbProxy.query(updateUsuarioQuery, [nombre, direccion, celular, correo, conductorId], (err) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return dbProxy.rollback(() => {
                    res.status(500).json({ status: 'error', message: 'Error al actualizar usuario' });
                });
            }

            // Obtener el ID del vehículo relacionado al conductor
            const vehiculoQuery = `
                SELECT vehiculo FROM empleado WHERE usuario_id = ?
            `;
            dbProxy.query(vehiculoQuery, [conductorId], (err, results) => {
                if (err || results.length === 0) {
                    console.error('Error al obtener vehículo:', err);
                    return dbProxy.rollback(() => {
                        res.status(500).json({ status: 'error', message: 'Vehículo no encontrado' });
                    });
                }

                const vehiculoId = results[0].vehiculo;

                // Actualizar los datos del vehículo
                const updateVehiculoQuery = `
                    UPDATE vehiculo 
                    SET placa = ?, marca = ?, anio = ? 
                    WHERE vehiculo_id = ?
                `;
                dbProxy.query(updateVehiculoQuery, [placa, marca, anio, vehiculoId], (err) => {
                    if (err) {
                        console.error('Error al actualizar vehículo:', err);
                        return dbProxy.rollback(() => {
                            res.status(500).json({ status: 'error', message: 'Error al actualizar vehículo' });
                        });
                    }

                    // Si se proporciona un PDF, subirlo y actualizar la tabla empleado
                    if (pdfActualizacion) {
                        const pdfFileName = `actualizacion_conductor_${conductorId}_${Date.now()}.pdf`;

                        // Simulación de la subida del PDF a S3 (lógica real va aquí)
                        const pdfUploadPromise = new Promise((resolve, reject) => {
                            const urlPDF = `https://s3.bucket/${pdfFileName}`; // Simulación de la URL después de la subida
                            resolve(urlPDF);
                        });

                        pdfUploadPromise.then((urlPDF) => {
                            const updateEmpleadoQuery = `
                                UPDATE empleado 
                                SET pdf_actualizacion = ?, estado_pdf = NULL 
                                WHERE usuario_id = ?
                            `;
                            dbProxy.query(updateEmpleadoQuery, [urlPDF, conductorId], (err) => {
                                if (err) {
                                    console.error('Error al actualizar empleado con PDF:', err);
                                    return dbProxy.rollback(() => {
                                        res.status(500).json({ status: 'error', message: 'Error al actualizar empleado con PDF' });
                                    });
                                }

                                // Confirmar la transacción
                                dbProxy.commit((err) => {
                                    if (err) {
                                        console.error('Error al confirmar la transacción:', err);
                                        return dbProxy.rollback(() => {
                                            res.status(500).json({ status: 'error', message: 'Error al confirmar la transacción' });
                                        });
                                    }

                                    res.status(200).json({ status: 'success', message: 'Información actualizada correctamente' });
                                });
                            });
                        }).catch((uploadErr) => {
                            console.error('Error subiendo el PDF:', uploadErr);
                            dbProxy.rollback(() => {
                                res.status(500).json({ status: 'error', message: 'Error subiendo el PDF' });
                            });
                        });
                    } else {
                        // Si no hay PDF, solo confirmar la transacción
                        dbProxy.commit((err) => {
                            if (err) {
                                console.error('Error al confirmar la transacción:', err);
                                return dbProxy.rollback(() => {
                                    res.status(500).json({ status: 'error', message: 'Error al confirmar la transacción' });
                                });
                            }

                            res.status(200).json({ status: 'success', message: 'Información actualizada correctamente' });
                        });
                    }
                });
            });
        });
    });
});

module.exports = routes;