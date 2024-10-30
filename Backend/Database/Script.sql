DROP DATABASE Qnave;
CREATE DATABASE Qnave;

USE Qnave;

CREATE TABLE rol (
    rol_id INT NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(25),
    PRIMARY KEY (rol_id)
);

CREATE TABLE estado_civil (
	estado_civil_id INT NOT NULL AUTO_INCREMENT,
	nombre_estado_civil VARCHAR(25),
	PRIMARY KEY (estado_civil_id)
);

-- Nueva tabla estado_cuenta
CREATE TABLE estado_cuenta (
    estado_cuenta_id INT NOT NULL AUTO_INCREMENT,
    estado_descripcion VARCHAR(25),
    PRIMARY KEY (estado_cuenta_id)
);

CREATE TABLE usuario(
    usuario_id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    genero CHAR(1) NOT NULL,
    dpi VARCHAR(13) NOT NULL,
    celular INT NOT NULL,
    edad INT NOT NULL,
    fotografia TEXT,
    direccion TEXT,
    password TEXT NOT NULL,
    estado_cuenta INT NOT NULL, -- Relación con la nueva tabla estado_cuenta
    estado_civil INT NOT NULL,
    rol INT NOT NULL,
    PRIMARY KEY (usuario_id),
    FOREIGN KEY (estado_cuenta) REFERENCES estado_cuenta (estado_cuenta_id), -- Relación con estado_cuenta
    FOREIGN KEY (estado_civil) REFERENCES estado_civil (estado_civil_id),
    FOREIGN KEY (rol) REFERENCES rol (rol_id)
);


CREATE TABLE marca_vehiculo (
	marca_id INT AUTO_INCREMENT NOT NULL,
	marca_nombre VARCHAR(25),
	PRIMARY KEY (marca_id)
);

CREATE TABLE vehiculo (
	vehiculo_id INT AUTO_INCREMENT NOT NULL,
	fotografia TEXT,
	placa VARCHAR(25),
	anio INT,
	marca INT,
	PRIMARY KEY (vehiculo_id),
	FOREIGN KEY (marca) REFERENCES marca_vehiculo (marca_id)
);

CREATE TABLE empleado (
	codigo_empleado INT AUTO_INCREMENT NOT NULL,
	curriculum TEXT,
	usuario_id INT NOT NULL,
	vehiculo INT,
	PRIMARY KEY (codigo_empleado),
	FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id),
	FOREIGN KEY (vehiculo) REFERENCES vehiculo (vehiculo_id)
);

CREATE TABLE zonas (
	zona INT AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (zona)
);

CREATE TABLE tarifa (
	tarifa_id INT AUTO_INCREMENT NOT NULL,
	inicio INT NOT NULL,
	fin INT NOT NULL,
	precio INT NOT NULL,
	PRIMARY KEY (tarifa_id),
	FOREIGN KEY (inicio) REFERENCES zonas(zona),
    FOREIGN KEY (fin) REFERENCES zonas(zona)
);

CREATE TABLE viaje (
    viaje_id INT AUTO_INCREMENT NOT NULL,
    estado INT NOT NULL, -- Esta será la llave foránea a la tabla estado_viaje
    fecha DATE,
    tarifa INT NOT NULL,
    metodo_pago CHAR(1),
    usuario_solicitud INT,
    usuario_conductor INT,
    PRIMARY KEY (viaje_id),
    FOREIGN KEY (estado) REFERENCES estado_viaje (estado_id),
    FOREIGN KEY (tarifa) REFERENCES tarifa (tarifa_id),
    FOREIGN KEY (usuario_solicitud) REFERENCES usuario (usuario_id),
    FOREIGN KEY (usuario_conductor) REFERENCES usuario (usuario_id)
);


CREATE TABLE estado_viaje (
    estado_id INT AUTO_INCREMENT NOT NULL,
    estado_descripcion VARCHAR(50) NOT NULL,
    PRIMARY KEY (estado_id)
);


CREATE TABLE categoria_problema (
	categoria_id INT AUTO_INCREMENT NOT NULL,
	categoria_nombre VARCHAR(100),
	PRIMARY KEY (categoria_id)
);

CREATE TABLE conductor_problema (
	problema_id INT AUTO_INCREMENT NOT NULL,
	categoria INT NOT NULL,
	evidencia TEXT,
	resolucion TEXT,
	viaje INT NOT NULL,
	PRIMARY KEY (problema_id),
	FOREIGN KEY (categoria) REFERENCES categoria_problema (categoria_id),
	FOREIGN KEY (viaje) REFERENCES viaje (viaje_id)
);

ALTER TABLE conductor_problema
ADD COLUMN descripcion TEXT;


CREATE TABLE usuario_problema (
	problema_id INT AUTO_INCREMENT NOT NULL,
	viaje INT NOT NULL,
	descripcion TEXT NOT NULL,
	fecha DATE,
	PRIMARY KEY (problema_id),
	FOREIGN KEY (viaje) REFERENCES viaje (viaje_id)
);

ALTER TABLE usuario 
ADD COLUMN correo VARCHAR(50) UNIQUE;

ALTER TABLE usuario 
DROP COLUMN dpi;

ALTER TABLE usuario 
ADD COLUMN dpi VARCHAR(13) UNIQUE;

CREATE TABLE calificacion_usuario (
	calificacion_id INT AUTO_INCREMENT NOT NULL,
	puntaje INT NOT NULL,
	comentario TEXT,
	viaje INT,
	PRIMARY KEY (calificacion_id),
	FOREIGN KEY (viaje) REFERENCES viaje (viaje_id)
);

CREATE TABLE calificacion_conductor (
	calificacion_id INT AUTO_INCREMENT NOT NULL,
	puntaje INT NOT NULL,
	comentario TEXT,
	viaje INT,
	PRIMARY KEY (calificacion_id),
	FOREIGN KEY (viaje) REFERENCES viaje (viaje_id)
);

ALTER TABLE usuario
ADD COLUMN fecha_nacimiento DATE;

ALTER TABLE usuario
ADD COLUMN username varchar(50) UNIQUE;

ALTER TABLE usuario MODIFY COLUMN edad int DEFAULT 0 NOT NULL;
ALTER TABLE usuario MODIFY COLUMN estado_cuenta int DEFAULT 1 NOT NULL;
ALTER TABLE usuario MODIFY COLUMN estado_civil int DEFAULT 1 NOT NULL;

ALTER TABLE usuario_problema MODIFY COLUMN viaje int NULL;

ALTER TABLE Qnave.usuario_problema ADD nombre_conductor varchar(100) NULL;
ALTER TABLE Qnave.usuario_problema ADD placa varchar(25) NULL;

CREATE TABLE motivo_cancelacion (
	motivo_cancelacion_id INT AUTO_INCREMENT NOT NULL,
	viaje_id INT NOT NULL,
	tiempo_espera bool,
	no_conductor bool, 
	otro bool, 
	comentario text,
	PRIMARY KEY (motivo_cancelacion_id),
	FOREIGN KEY (viaje_id) REFERENCES viaje (viaje_id)
);

ALTER TABLE empleado
ADD COLUMN estado_cv TINYINT(1) NULL;

ALTER TABLE empleado
ADD COLUMN pdf_actualizacion TEXT, -- Para guardar la ruta del PDF
ADD COLUMN fecha_cambios DATE,     -- Para registrar la fecha de los cambios
ADD COLUMN estado_pdf TEXT; -- Estado del PDF

CREATE TABLE motivos_bajas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE motivos_despido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asistente_id INT NOT NULL,
    motivo_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (motivo_id) REFERENCES motivos_bajas(id),
    FOREIGN KEY (asistente_id) REFERENCES usuario(usuario_id)
);

<<<<<<< HEAD
CREATE TABLE ofertas (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único para cada oferta
    descripcion VARCHAR(255) NOT NULL,  -- Descripción de la oferta
    descuento DECIMAL(5,2) NOT NULL,    -- Porcentaje de descuento (por ejemplo, 8.00 para 8%)
    fecha_inicio DATE NOT NULL,         -- Fecha de inicio de la oferta
    fecha_fin DATE NOT NULL,            -- Fecha de fin de la oferta
    estado ENUM('ACTIVA', 'EXPIRADA', 'USADA') DEFAULT 'ACTIVA',  -- Estado de la oferta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Fecha de última actualización
);
=======
CREATE TABLE destino (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	zona INT NOT NULL,
);
>>>>>>> feature202003381
