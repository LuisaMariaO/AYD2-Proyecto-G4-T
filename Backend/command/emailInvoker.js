class EmailInvoker {
    constructor() {
      this.history = [];
    }
  
    setCommand(command) {
      this.command = command;
    }
  
    sendEmail() {
      this.history.push(this.command);
      return this.command.execute();
    }
  }
  
  module.exports = EmailInvoker;
  