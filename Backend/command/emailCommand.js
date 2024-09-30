class EmailCommand {
  constructor(transporter) {
    this.transporter = transporter;
  }

  execute() {
    throw new Error("Este método debe ser implementado por las subclases");
  }
}

module.exports = EmailCommand;
