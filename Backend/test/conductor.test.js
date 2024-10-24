const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server'); // Asegúrate de ajustar el path a tu archivo del servidor
const { expect } = chai;

chai.use(chaiHttp);

// -------- PRUEBAS UNITARIAS --------

// Mockear nodemailer
nodemailer.createTransport = () => ({
  sendMail: () => Promise.resolve('Correo enviado')
});

describe('Pruebas unitarias - Generación de contraseña temporal', () => {
  it('Debe generar una contraseña temporal de 8 caracteres', () => {
    const passwordTemporal = crypto.randomBytes(4).toString('hex');
    expect(passwordTemporal).to.have.lengthOf(8); // Verifica que tiene 8 caracteres
  });

  it('Debe cifrar la contraseña temporal correctamente', async () => {
    const passwordTemporal = 'abcd1234'; // Simulamos una contraseña
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
    const isMatch = await bcrypt.compare(passwordTemporal, hashedPassword);
    
    expect(isMatch).to.be.true; // Verifica que la contraseña cifrada coincide con la original
  });
});

describe('Pruebas unitarias - Envío de correos electrónicos', () => {
  it('Debe configurar correctamente las opciones del correo', async () => {
    const transporter = nodemailer.createTransport({
      service: 'fake-service',
      auth: {
        user: 'test@test.com',
        pass: 'password'
      }
    });

    const mailOptions = {
      from: 'test@test.com',
      to: 'user@example.com',
      subject: 'Test email',
      text: 'Este es un correo de prueba'
    };

    const info = await transporter.sendMail(mailOptions);
    
    expect(info).to.equal('Correo enviado');
  });
});

// Función a probar: calcularTotalTarifas
function calcularTotalTarifas(viajes) {
  return viajes.reduce((total, viaje) => total + viaje.precio, 0);
}

describe('Prueba unitaria - calcularTotalTarifas', () => {
it('Debería calcular correctamente el total de tarifas para una lista de viajes', () => {
  const viajes = [
    { viaje_id: 1, fecha: '2024-01-01', estado: 'completado', precio: 50 },
    { viaje_id: 2, fecha: '2024-01-02', estado: 'completado', precio: 75 },
    { viaje_id: 3, fecha: '2024-01-03', estado: 'cancelado', precio: 0 }
  ];

  const totalTarifas = calcularTotalTarifas(viajes);
  
  expect(totalTarifas).to.equal(125); // 50 + 75
});

it('Debería retornar 0 si no hay viajes en la lista', () => {
  const viajes = []; // Lista vacía

  const totalTarifas = calcularTotalTarifas(viajes);

  expect(totalTarifas).to.equal(0); // No hay tarifas
});

it('Debería manejar correctamente una lista con viajes cancelados', () => {
  const viajes = [
    { viaje_id: 1, fecha: '2024-01-01', estado: 'cancelado', precio: 0 },
    { viaje_id: 2, fecha: '2024-01-02', estado: 'cancelado', precio: 0 }
  ];

  const totalTarifas = calcularTotalTarifas(viajes);

  expect(totalTarifas).to.equal(0); // Todos los viajes cancelados, total es 0
});
});


// -------- PRUEBAS DE INTEGRACIÓN --------

describe('Pruebas de integración - loginCodigo', () => {
  it('Debería retornar un error 400 al no encontrar el usuario', (done) => {
    chai.request(app)
      .post('/conductor/loginCodigo')
      .send({ codigoTrabajador: '1555' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('Deberia retornar un codigo 200 al encontrar el usuario y mensaje de success', (done) => {
    chai.request(app)
      .post('/conductor/loginCodigo')
      .send({ codigoTrabajador: '15' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'success');
        done();
      });

  });

});

describe('Pruebas de integración - categoriasProblema', () => {
  it('Debería retornar una lista de categorías', (done) => {
    chai.request(app)
      .get('/conductor/categoriasProblema')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('Pruebas de integración - viajesConductor', () => {
  it('Debería retornar un código 200 y una lista de viajes para un conductor válido', (done) => {
    chai.request(app)
      .get('/conductor/viajesConductor/15') // Simulamos el ID del conductor 1
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.viajes).to.be.an('array');
        done();
      });
  });


  it('Debería retornar un código 404 si no se encuentran viajes para el conductor', (done) => {
    chai.request(app)
      .get('/conductor/viajesConductor/999') // Simulamos un conductor sin viajes
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body.message).to.equal('No se encontraron viajes para este conductor');
        done();
      });
  });
});


