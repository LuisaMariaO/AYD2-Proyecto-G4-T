const EmailCommand = require('./emailCommand');

class RecuperarContrasenaUsuaruiCommand extends EmailCommand {
  constructor(transporter, nombreCompleto, correo, username) {
    super(transporter);
    this.mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Recuperación de contraseña de QNave',
      text: `Hola ${nombreCompleto},\n\nPara cambiar tu contraseña, accede al siguiente enlace: http://localhost:3000/cambiar-password/${username}.\n\n¡Felices viajes!.`
    };
  }

  execute() {
    return this.transporter.sendMail(this.mailOptions);
  }
}

module.exports = RecuperarContrasenaUsuaruiCommand;
