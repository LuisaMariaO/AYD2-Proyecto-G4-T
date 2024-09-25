const connectToDatabase = require('./db');

const dbProxy = new Proxy(connectToDatabase(), {
    get(target, property) {
        if (typeof target[property] === 'function') {
            return function (...args) {
                console.log(`Interceptando llamada al método: ${property}`);
                console.log(`Parámetros: ${JSON.stringify(args)}`);
                
                // Ejecutar la función original
                return target[property](...args);
            };
        }
        return target[property];
    }
});

module.exports = dbProxy;
