const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Cambia la URL si tu aplicación corre en otro puerto
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
