const { json } = require('express')
const express = require('express')
const routes = express.Router()
const subirImagenBase64 = require('../bucket');
const dbProxy = require('../dbProxy');
const transporter = require('../command/transporter');
const EmailInvoker = require('../command/emailInvoker');
const VerificacionEmailCommand = require('../command/verificacionCommand');
const RecuperarContrasenaUsuaruiCommand = require('../command/recuperarContrasenaUsuarioCommand');
const { emitirViajeUsusario } = require('../socket');  // Función de WebSocket
const { stat } = require('fs');

const emailInvoker = new EmailInvoker();

routes.get('/check', (req, res) => {
    return res.status(200).json({
        status: "ok"
    })
})

routes.get('/getUsuarios', (req, res) => {
    dbProxy.query('SELECT * FROM usuario', [], (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', data: results });
    });
});

routes.post('/registro', (req, res) => {
    const { nombre, fecha_nacimiento, genero, correo, celular, password } = req.body;
    username = generarNombreUsuario(nombre)
    dbProxy.query('INSERT INTO usuario (nombre, fecha_nacimiento, genero, correo, celular, password, rol, username) VALUES (?,?,?,?,?,?,3,?)', [nombre, fecha_nacimiento, genero, correo, celular, password, username], (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        //Construcción del correo electrónico
        const verificacionEmailCommand = new VerificacionEmailCommand(transporter, nombre, correo, username);
        //Envío del correo
        emailInvoker.setCommand(verificacionEmailCommand);
        emailInvoker.sendEmail().then((info) => {
            res.status(200).json({ message: '¡Usuario registrado y correo de verificación enviado!' });
        }).catch((err) => {
            console.error("Error al enviar el correo electrónico:", err);
        });

    });
});

function generarNombreUsuario(nombre) {
    const nombreLimpio = nombre.trim().toLowerCase();

    const partes = nombreLimpio.split(' ');

    if (partes.length < 2) {
        throw new Error('Debes proporcionar al menos un nombre y un apellido.');
    }

    // Si tiene más de un nombre, entonces el username se generará con los primeros dos nombres
    const parte1 = partes[0];
    const parte2 = partes[1];

    //Tomando los primeros tres caracteres
    const usernameParte1 = parte1.substring(0, 3);
    const usernameParte2 = parte2.substring(0, 3);

    // Generar un número aleatorio de 3 cifras
    const numeroAleatorio = Math.floor(100 + Math.random() * 900); // Número entre 100 y 999

    const nombreUsuario = `${usernameParte1}${usernameParte2}${numeroAleatorio}`;

    return nombreUsuario;
}

routes.post('/verificar', (req, res) => {
    const { username } = req.body;
    dbProxy.query('UPDATE usuario SET estado_cuenta = 2 WHERE username=?;', [username], (err, results) => {
        if (err) {
            console.error('Error al verificar cuenta:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        res.status(200).json({ message: '¡Cuenta verificada!' });


    });

});

routes.post('/cambiarContrasena', (req, res) => {
    const { username, password } = req.body;
    dbProxy.query('UPDATE usuario SET password = ? WHERE username=?;', [password, username], (err, results) => {
        if (err) {
            console.error('Error al verificar cuenta:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        res.status(200).json({ message: '¡Contraseña cambiada!' });


    });

});

routes.post('/solicitudCambiarContrasena', (req, res) => {
    const { username } = req.body;
    dbProxy.query('SELECT nombre, correo, username FROM usuario WHERE username=? OR correo=?;', [username, username], (err, results) => {
        if (err) {
            console.error('No se encontró el usuario:', err);
            return res.status(200).json({ message: 'No se encontró la cuenta', status: 0 });
        }

        const recuperarContrasenaUsuarioCommand = new RecuperarContrasenaUsuaruiCommand(transporter, results[0].nombre, results[0].correo, results[0].username);
        //Envío del correo
        emailInvoker.setCommand(recuperarContrasenaUsuarioCommand);
        emailInvoker.sendEmail().then((info) => {
            res.status(200).json({ message: '¡Correo enviado!', status: 1 });
        }).catch((err) => {
            res.status(500).json({ message: 'Error en el servidor', status: 0 });
            console.error("Error al enviar el correo electrónico:", err);
        });

    });

});

routes.post('/login', (req, res) => {
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

        // Si todo es correcto, responde con un mensaje de éxito
        res.status(200).json({ message: '¡Inicio de sesión exitoso!', username: user.username, name: user.nombre, id: user.usuario_id, status: 1 });
    });

});

routes.post('/reportarProblema', (req, res) => {
    const { username, descripcion, fecha, nombre_conductor, placa } = req.body;
    dbProxy.query('INSERT INTO usuario_problema (descripcion, fecha, nombre_conductor, placa, username) VALUES (?,?,?,?,?)', [descripcion, fecha, nombre_conductor, placa, username], (err, results) => {
        if (err) {
            console.error('Error al reportar problema:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        res.status(200).json({ message: '¡Problema reportado!' });
    });
});

routes.post('/solicitarViaje', (req, res) => {
    const { usuario_id, inicio, fin } = req.body;
    dbProxy.query('SELECT tarifa_id FROM tarifa WHERE inicio = ? AND fin = ?', [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al buscar la tarifa:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Tarifa no encontrada para el inicio y fin proporcionados' });
        }

        const tarifa_id = results[0].tarifa_id;

        dbProxy.query(
            'INSERT INTO viaje (estado, fecha, tarifa, metodo_pago, usuario_solicitud) VALUES (1,now(),?,?,?)',
            [tarifa_id, 'T', usuario_id],
            (err) => {
                if (err) {
                    console.error('Error al insertar el viajeviaje:', err);
                    return res.status(500).json({ message: 'Error en el servidor' });
                }

                dbProxy.query('SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, t.inicio, t.fin, t.precio, v.usuario_conductor, v.usuario_solicitud,u.nombre, vh.placa, vh.fotografia, ma.marca_nombre FROM viaje v LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa LEFT JOIN estado_viaje e ON v.estado=e.estado_id LEFT JOIN usuario u ON u.usuario_id = usuario_conductor LEFT JOIN empleado em ON em.usuario_id=usuario_conductor LEFT JOIN vehiculo vh ON vh.vehiculo_id=em.vehiculo LEFT JOIN marca_vehiculo ma ON ma.marca_id=vh.marca WHERE (estado = 1 OR estado = 2)  AND usuario_solicitud = ?', [usuario_id], (err, viajes) => {
                    if (err) {
                        console.error('Error al consultar viajes:', err);
                        return res.status(500).json({ message: 'Error en el servidor' });
                    }

                    // Emite la actualización al cliente con el estado de los viajes
                    emitirViajeUsusario(viajes);

                    res.status(200).json({ message: '¡Viaje solicitado!' });


                }
                );
            });
    });
});

routes.post('/getViajesPendientes', (req, res) => {
    const { usuario_id } = req.body;
    dbProxy.query('SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, t.inicio, t.fin, t.precio, v.usuario_conductor,v.usuario_solicitud, u.nombre, vh.placa, vh.fotografia, ma.marca_nombre FROM viaje v LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa LEFT JOIN estado_viaje e ON v.estado=e.estado_id LEFT JOIN usuario u ON u.usuario_id = usuario_conductor LEFT JOIN empleado em ON em.usuario_id=usuario_conductor LEFT JOIN vehiculo vh ON vh.vehiculo_id=em.vehiculo LEFT JOIN marca_vehiculo ma ON ma.marca_id=vh.marca WHERE (estado = 1 OR estado = 2)  AND usuario_solicitud = ?', [usuario_id], (err, results) => {
        if (err) {
            console.error('Error al obtener los viajes:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Registros obtenidos', viajes: results });
    });
});

routes.post('/cancelarViaje', (req, res) => {
    const { viaje_id, tiempo_espera, no_conductor, otro, comentario, usuario_id } = req.body;
    dbProxy.query('UPDATE viaje SET estado=4 WHERE viaje_id = ?', [viaje_id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el estado del viaje:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        dbProxy.query('INSERT INTO motivo_cancelacion (viaje_id, tiempo_espera, no_conductor, otro, comentario) VALUES(?,?,?,?,?)', [viaje_id, tiempo_espera, no_conductor, otro, comentario], (err, results) => {
            if (err) {
                console.error('Error al registrar el motivo de cancelación del viaje:', err);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            dbProxy.query('SELECT v.viaje_id, v.fecha, v.estado, e.estado_descripcion, t.inicio, t.fin, t.precio, v.usuario_conductor,v.usuario_solicitud, u.nombre, vh.placa, vh.fotografia, ma.marca_nombre FROM viaje v LEFT JOIN tarifa t ON t.tarifa_id = v.tarifa LEFT JOIN estado_viaje e ON v.estado=e.estado_id LEFT JOIN usuario u ON u.usuario_id = usuario_conductor LEFT JOIN empleado em ON em.usuario_id=usuario_conductor LEFT JOIN vehiculo vh ON vh.vehiculo_id=em.vehiculo LEFT JOIN marca_vehiculo ma ON ma.marca_id=vh.marca WHERE (estado = 1 OR estado = 2)  AND usuario_solicitud = ?', [usuario_id], (err, viajes) => {
                if (err) {
                    console.error('Error al consultar viajes:', err);
                    return res.status(500).json({ message: 'Error en el servidor' });
                }

                // Emite la actualización al cliente con el estado de los viajes
                emitirViajeUsusario(viajes);

                res.status(200).json({ message: '¡Viaje cancelado!' });


            }
            );
        });


    });
});

routes.get('/getUsuario/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;
    dbProxy.query('SELECT * FROM usuario WHERE usuario_id = ?', [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Usuario obtenido', data: results });
    });
});

routes.post("/updateUsuario", (req, res) => {
    const { userId, nombre, fecha_nacimiento, genero, celular, correo, password } = req.body;

    dbProxy.query(`
        UPDATE usuario
        SET nombre = COALESCE(?, nombre),
            fecha_nacimiento = COALESCE(?, fecha_nacimiento),
            genero = COALESCE(?, genero),
            celular = COALESCE(?, celular),
            correo = COALESCE(?, correo),
            password = COALESCE(?, password)
        WHERE usuario_id = ?;       
        `, [nombre, fecha_nacimiento, genero, celular, correo, password, userId], (err, results) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Usuario actualizado', data: results });
    })
});

routes.get('/getCalificacionConductor/:usuarioId', (req, res) => {
    const { usuarioId } = req.params;
    dbProxy.query(`
        SELECT ROUND(AVG(cc.puntaje),1) AS calificacion
        FROM calificacion_conductor cc
        LEFT JOIN viaje v ON v.viaje_id = cc.viaje 
        WHERE v.usuario_conductor  = ?;
        `, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Calificacion', data: results[0] });
    });
});

routes.post('/calificarViaje', (req, res) => {
    const { viaje_id, calificacion, comentario } = req.body;
    dbProxy.query('INSERT INTO calificacion_conductor (viaje, puntaje, comentario) VALUES (?,?,?)', [viaje_id, calificacion, comentario], (err, results) => {
        if (err) {
            console.error('Error al calificar el viaje:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Calificación guardada', data: results[0] });
    });
});

routes.post('/guardarUbicacion', (req, res) => {
    const { usuario_id, nombre, zona } = req.body;
    dbProxy.query('INSERT INTO destino (nombre, zona, usuario_id) VALUES (?,?,?)', [nombre, zona, usuario_id], (err, results) => {
        if (err) {
            console.error('Error al guardar la ubicación:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({ message: 'Ubicación guardada', data: results[0] });
    });
});

module.exports = routes