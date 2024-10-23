describe('Pruebas E2E para Login Conductor', () => {
  beforeEach(() => {
    // Visita la página de login antes de cada prueba
    cy.visit('http://localhost:3000/loginConductor'); // Cambia la URL según tu entorno
  });

  it('Debe mostrar el formulario de inicio de sesión correctamente', () => {
    // Verifica que los elementos del formulario estén visibles
    cy.get('input#user').should('be.visible'); // Campo de correo o DPI
    cy.get('input#password').should('be.visible'); // Campo de contraseña
    cy.get('#login-button').should('be.visible'); // Botón de inicio de sesión
  });

  it('Debe permitir al usuario iniciar sesión con correo o DPI', () => {
    // Simula la entrada de datos en los campos de usuario y contraseña
    cy.get('input#user').type('luisinmanuel123@gmail.com'); // Cambia por un correo válido de prueba
    cy.get('input#password').type('luisinde'); // Cambia por una contraseña válida de prueba

    // Clic en el botón de inicio de sesión con el ID nuevo
    cy.get('#login-button').click();

    // Verifica la redirección después del inicio de sesión
    cy.url().should('include', '/conductor'); // Verifica que la URL cambió correctamente
  });

  it('Debe mostrar un error si el inicio de sesión falla', () => {
    // Introduce un usuario y contraseña inválidos
    cy.get('input#user').type('usuario_invalido@ejemplo.com');
    cy.get('input#password').type('contraseña_incorrecta');

    // Clic en el botón de inicio de sesión con el ID nuevo
    cy.get('#login-button').click();

    // Verifica que un mensaje de error se muestra usando SweetAlert
    cy.get('.swal2-popup').should('be.visible');
  });

  it('Debe permitir el inicio de sesión con código de trabajador', () => {
    // Introduce un código de trabajador válido
    cy.get('input#codigoTrabajador').type('15'); // Cambia por un código de prueba

    // Clic en el botón de inicio de sesión con el código de trabajador
    cy.get('#codigo-trabajador-button').click();

    // Verifica la redirección después del inicio de sesión
    cy.url().should('include', '/conductor');
  });


  it('Debe permitir regresar a la página principal', () => {
    // Clic en el botón de "Regresar a la página principal"
    cy.get('#regresar-button').click();

    // Verifica que el usuario fue redirigido a la página principal
    cy.url().should('eq', 'http://localhost:3000/'); // Ajusta la URL según tu ruta principal
  });
});

describe('Pruebas E2E para la página de Ganancias', () => {
  beforeEach(() => {
    // Simulamos que el conductor está autenticado y su ID está almacenado en localStorage
    localStorage.setItem('conductorId', '123'); // Cambia el ID según corresponda en tu entorno

    // Visita la página de ganancias antes de cada prueba
    cy.visit('http://localhost:3000/ganancias'); // Cambia la URL según tu entorno
  });

  it('Debe mostrar el resumen de ganancias correctamente', () => {
    // Intercepta la solicitud al backend y simula una respuesta exitosa
    cy.intercept('POST', 'http://localhost:9000/conductor/ganancias', {
      statusCode: 200,
      body: {
        status: 'success',
        gananciasDiarias: '90.00',
        gananciasSemanales: '270.00',
        gananciasMensuales: '900.00',
        viajes: []
      }
    }).as('getGanancias');

    cy.reload();

    // Espera a que los datos de ganancias se carguen y verifica que se muestren correctamente
    cy.wait('@getGanancias');
    cy.contains('Ganancias Diarias: Q90.00').should('be.visible');
    cy.contains('Ganancias Semanales: Q270.00').should('be.visible');
    cy.contains('Ganancias Mensuales: Q900.00').should('be.visible');
  });



  it('Debe mostrar un mensaje de error si no se encuentran ganancias', () => {
    // Simula una respuesta de error
    cy.intercept('POST', 'http://localhost:9000/conductor/ganancias', {
      statusCode: 404,
      body: {
        status: 'error',
        message: 'No se encontraron ganancias.'
      }
    }).as('getGananciasError');

    cy.reload();

    // Espera a que la solicitud falle
    cy.wait('@getGananciasError');

    // Verifica que el mensaje de error se muestre correctamente
    cy.get('.swal2-popup').should('be.visible').contains('Error');
  });
});

