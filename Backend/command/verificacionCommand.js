const EmailCommand = require('./emailCommand');

class VerificacionEmailCommand extends EmailCommand {
  constructor(transporter, nombreCompleto, correo, username) {
    super(transporter);
    this.mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Bienvendo a QNave',
      text: `Hola ${nombreCompleto},\n\nTu nombre de usuario es: ${username}\n\nVerifica tu cuenta en el siguiente enlace: http://localhost:3000/verificar-user/${username}.\n\n¡Felices viajes!.`
    };
  }

  execute() {
    return this.transporter.sendMail(this.mailOptions);
  }
}

module.exports = VerificacionEmailCommand;
