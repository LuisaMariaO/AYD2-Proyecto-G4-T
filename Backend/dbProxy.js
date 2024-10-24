const { connectToDatabase, closeDatabaseConnection } = require('./db');

const dbProxy = new Proxy(connectToDatabase(), {
    get(target, property) {
        if (typeof target[property] === 'function') {
            return function (...args) {
                // Ejecutar la función original
                return target[property](...args);
            };
        }
        return target[property];
    }
});

// Exponer también la función para cerrar la conexión
dbProxy.closeDatabaseConnection = closeDatabaseConnection;

module.exports = dbProxy;
