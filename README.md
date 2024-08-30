# AYD2-Proyecto-G4

## 3. LISTA DE REQUERIMINTOS FUNCIONALES GENERALES
Consiste en la identificación y especificación de las funcionalidades que el sistema debe cumplir para satisfacer las necesidades del negocio y de los usuarios. Este punto es crucial para establecer una base sólida sobre la cual se desarrollará el sistema. A continuación, se detallan los requerimientos funcionales generales para el proyecto "Qnave".

---

### **1. Registro de Usuarios, Conductores y Asistentes**

- **1.1. Registro de Usuario:**
  - El sistema debe permitir que un usuario se registre proporcionando los siguientes datos:
    - Nombre completo
    - Fecha de nacimiento
    - Género
    - Correo electrónico
    - Fotografía del DPI
    - Número de celular
    - Contraseña y confirmación de contraseña
    - Métodos de pago opcionales (tarjeta de crédito o efectivo)
  - El sistema debe validar que todos los campos obligatorios estén completos y sean correctos.
  - Se debe enviar una notificación por correo electrónico para la confirmación de la cuenta.
  - Los datos sensibles, como la contraseña y la información de la tarjeta de crédito, deben ser encriptados.

- **1.2. Registro de Conductor:**
  - El sistema debe permitir que un conductor se registre proporcionando:
    - Nombre completo
    - Número de teléfono
    - Edad
    - Número de DPI
    - Correo electrónico
    - Papelería completa (CV en formato PDF)
    - Fotografía
    - Fotografía del vehículo y número de placa
    - Marca y año del vehículo
    - Género
    - Estado civil
    - Número de cuenta bancaria
    - Dirección de domicilio
  - El sistema debe generar un código de empleado y una contraseña temporal, que el conductor deberá cambiar en su primer inicio de sesión.
  - Todos los datos proporcionados deben ser validados por el sistema para garantizar su precisión y completitud.

- **1.3. Registro de Asistente:**
  - El asistente debe ser registrado por el administrador, proporcionando los siguientes datos:
    - Nombre completo
    - Número de teléfono
    - Edad
    - Número de DPI
    - Correo electrónico
    - Papelería completa (CV en formato PDF)
    - Fotografía
    - Género
    - Estado civil
    - Número de cuenta bancaria
    - Dirección de domicilio
  - Al igual que con los conductores, se debe generar un código de empleado y una contraseña temporal, que deberá ser cambiada en el primer inicio de sesión.

### **2. Autenticación y Seguridad**

- **2.1. Inicio de Sesión:**
  - El sistema debe permitir que los usuarios, conductores y asistentes inicien sesión utilizando su correo electrónico y contraseña.
  - Los conductores y asistentes también pueden iniciar sesión usando un código de empleado.
  - La contraseña debe ser almacenada encriptada en la base de datos.

- **2.2. Recuperación de Contraseña:**
  - El sistema debe permitir a los usuarios, conductores y asistentes recuperar su contraseña a través de un proceso de validación por correo electrónico.
  - En caso de que un asistente olvide su contraseña, el administrador debe poder restablecerla desde su plataforma.

- **2.3. Bloqueo de Cuenta:**
  - Si un usuario, conductor o asistente ingresa incorrectamente su contraseña cinco veces, la cuenta debe ser bloqueada y se debe enviar un correo electrónico notificando el bloqueo.
  - El desbloqueo de la cuenta puede ser gestionado mediante un proceso de recuperación o intervención del administrador.

### **3. Gestión de Viajes**

- **3.1. Solicitud de Viaje:**
  - El usuario debe poder solicitar un viaje indicando su punto de partida y destino.
  - El sistema debe calcular automáticamente la tarifa del viaje basado en las zonas predefinidas.

- **3.2. Asignación de Conductor:**
  - El sistema debe enviar la solicitud de viaje a todos los conductores disponibles, garantizando que solo un conductor pueda aceptar el viaje.
  - El conductor que acepte primero la solicitud será asignado al viaje.

- **3.3. Cancelación de Viaje:**
  - Tanto el usuario como el conductor deben poder cancelar el viaje, especificando un motivo para la cancelación.
  - Si un viaje es cancelado por un conductor, el sistema debe intentar reasignar el viaje a otro conductor disponible.

### **4. Gestión de Información Personal**

- **4.1. Modificación de Información:**
  - Los usuarios y conductores deben poder modificar su información personal desde la aplicación.
  - Los cambios críticos, como la modificación de datos de contacto o del vehículo, deben ser aprobados por un asistente antes de hacerse efectivos.

- **4.2. Validación de Datos Duplicados:**
  - El sistema debe validar que un usuario, conductor o asistente no se registre más de una vez con la misma información, evitando duplicados en la base de datos.

### **5. Interacción y Calificación**

- **5.1. Calificación y Comentarios:**
  - Después de un viaje, el usuario debe poder calificar al conductor y dejar un comentario.
  - El conductor también debe poder calificar al usuario después de completar un viaje.

- **5.2. Visualización de Información:**
  - Antes de aceptar un viaje, el conductor debe poder ver la información básica del usuario (nombre, calificación, comentarios).
  - Los usuarios deben poder ver la información del conductor asignado, incluyendo su nombre, calificación y detalles del vehículo.

### **6. Gestión de Pagos**

- **6.1. Métodos de Pago:**
  - El usuario debe poder agregar, modificar o eliminar métodos de pago (tarjeta de crédito o efectivo).
  - El sistema debe gestionar de manera segura la información de las tarjetas de crédito, cumpliendo con las normativas de seguridad.

- **6.2. Pago del Viaje:**
  - El sistema debe permitir al usuario pagar por el viaje al finalizarlo, utilizando el método de pago registrado o seleccionando pagar en efectivo.

### **7. Reportes y Estadísticas**

- **7.1. Generación de Reportes:**
  - El sistema debe permitir al administrador generar reportes sobre diversos aspectos, como el uso de la plataforma, ganancias, calificaciones y estadísticas de registro.

- **7.2. Visualización de Estadísticas:**
  - El administrador debe poder visualizar estadísticas en gráficos que muestren la cantidad de usuarios, conductores y asistentes registrados, así como el número de viajes completados, cancelados y en espera.
