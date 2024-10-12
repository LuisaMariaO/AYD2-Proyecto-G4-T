INSERT INTO categoria_problema (categoria_nombre)
VALUES
('Fallos técnicos'),
('Problemas de pago'),
('Problemas de conexión a la app'),
('Instrucciones de navegación incorrectas'),
('Problemas con el GPS'),
('Incidencias con pasajeros'),
('Problemas con la verificación de identidad'),
('Condiciones del vehículo'),
('Problemas de seguridad'),
('Retrasos en la asignación de viajes'),
('Falta de soporte al conductor'),
('Problemas con la evaluación y calificación'),
('Cambios en las tarifas'),
('Incidentes con otros vehículos'),
('Problemas de comunicación con el centro de soporte');


INSERT INTO estado_civil (nombre_estado_civil)
VALUES 
('Soltera/o'),
('Casada/o'),
('Divorciado'),
('Viudo'),
('Unido de hecho'),
('Separado'),
('En pareja');

INSERT INTO marca_vehiculo (marca_nombre)
VALUES
('Toyota'),
('Ford'),
('Honda'),
('Chevrolet'),
('Nissan'),
('Volkswagen'),
('Hyundai'),
('Kia'),
('Subaru'),
('Mazda'),
('BMW'),
('Mercedes-Benz'),
('Audi'),
('Porsche'),
('Tesla');

INSERT INTO rol (nombre_rol)
VALUES
('Administrador'),
('Asistente'),
('Usuario'),
('Conductor');

INSERT INTO zonas (zona)
VALUES 
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12);

INSERT INTO tarifa (inicio, fin, precio) 
VALUES
(1, 2, 10),
(1, 3, 15),
(1, 4, 20),
(1, 5, 20),
(1, 6, 25),
(1, 7, 30),
(1, 8, 30),
(1, 9, 40),
(1, 10, 50),
(1, 11, 50),
(1, 12, 25),
(2, 3, 25),
(2, 4, 25),
(2, 5, 25),
(2, 6, 30),
(2, 7, 40),
(2, 8, 40),
(2, 9, 60),
(2, 10, 70),
(2, 11, 50),
(2, 12, 35),
(3, 4, 20),
(3, 5, 30),
(3, 6, 35),
(3, 7, 25),
(3, 8, 25),
(3, 9, 40),
(3, 10, 45),
(3, 11, 40),
(3, 12, 30),
(4, 5, 15),
(4, 6, 25),
(4, 7, 25),
(4, 8, 25),
(4, 9, 15),
(4, 10, 30),
(4, 11, 35),
(4, 12, 35),
(5, 6, 15),
(5, 7, 25),
(5, 8, 35),
(5, 9, 25),
(5, 10, 35),
(5, 11, 40),
(5, 12, 40),
(6, 7, 30),
(6, 8, 35),
(6, 9, 40),
(6, 10, 50),
(6, 11, 65),
(6, 12, 60),
(7, 8, 25),
(7, 9, 35),
(7, 10, 40),
(7, 11, 40),
(7, 12, 40),
(8, 9, 25),
(8, 10, 35),
(8, 11, 35),
(8, 12, 35),
(9, 10, 15),
(9, 11, 35),
(9, 12, 30),
(10, 11, 50),
(10, 12, 50),
(11, 12, 50);


-- Insertar valores predefinidos para estado de cuenta
INSERT INTO estado_cuenta (estado_descripcion) VALUES ('No activado');
INSERT INTO estado_cuenta (estado_descripcion) VALUES ('Activado');
INSERT INTO estado_cuenta (estado_descripcion) VALUES ('Suspendido')

-- Primer viaje
INSERT INTO viaje (estado, fecha, tarifa, metodo_pago, usuario_solicitud, usuario_conductor)
VALUES ('C', '2024-09-25', 1, 'T', 1, 2);

-- Segundo viaje
INSERT INTO viaje (estado, fecha, tarifa, metodo_pago, usuario_solicitud, usuario_conductor)
VALUES ('F', '2024-09-26', 2, 'E', 3, 2);

-- Insertar estados en la tabla estado_viaje
INSERT INTO estado_viaje (estado_descripcion) VALUES 
('Pendiente'),    -- Cuando el viaje ha sido solicitado pero no ha comenzado
('En progreso'),  -- Cuando el viaje está siendo realizado
('Completado'),   -- Cuando el viaje ha sido completado con éxito
('Cancelado'),    -- Cuando el viaje ha sido cancelado
('Rechazado');    -- Cuando el conductor o usuario rechaza el viaje

INSERT INTO motivos_bajas (descripcion) VALUES
('Reajuste de personal'),
('No cumplió con las políticas de la empresa'),
('Falta de puntualidad'),
('Malas evaluaciones de los clientes'),
('Infracciones graves'),
('Desempeño inadecuado'),
('Quejas reiteradas');

INSERT INTO destino (nombre, zona) VALUES
('Zona 1', 1),
('Zona 2', 2),
('Zona 3', 3),
('Zona 4', 4),
('Zona 5', 5),
('Zona 6', 6),
('Zona 7', 7),
('Zona 8', 8),
('Zona 9', 9),
('Zona 10', 10),
('Zona 11', 11),
('Zona 12', 12);