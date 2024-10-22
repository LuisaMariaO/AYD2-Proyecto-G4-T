const mysql = require('mysql2');

let connection;

const DBconfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

function connectToDatabase() {
    if (!connection) {
        connection = mysql.createConnection(DBconfig);
        console.log("Conexión a la base de datos creada.");

        // Manejar errores de la conexión
        connection.connect(err => {
            if (err) {
                console.error('Error conectando a la base de datos:', err.stack);
                return;
            }
            console.log('Conectado a la base de datos.');
        });
    } else {
        console.log("Usando la conexión existente.");
    }
    return connection;
}

function closeDatabaseConnection(callback) {
    if (connection) {
        connection.end(err => {
            if (err) {
                console.error('Error cerrando la conexión a la base de datos:', err.stack);
                return callback(err);
            }
            console.log('Conexión a la base de datos cerrada.');
            connection = null; // Limpiar la referencia a la conexión
            callback();
        });
    } else {
        callback(); // Si no hay conexión, simplemente ejecuta el callback
    }
}


module.exports = { connectToDatabase, closeDatabaseConnection };
