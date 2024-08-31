Universidad de San Carlos de Guatemala  
Facultad de Ingenieria  
Escuela de ciencias y sistemas  
Laboratorio de analisis y diseño 2  
![Logo USAC](https://upload.wikimedia.org/wikipedia/commons/4/4a/Usac_logo.png)  


|  Carnet | Nombre   |
| ------------ | ------------ |
| Luisa Maria Ortiz Romero  | 202003381   |
| Marjorie Gissell Reyes Franco | 202000560   |
| Luis Manuel Chay Marroquin  | 202000343  |
| Cristian Alessander Blanco Gonzalez  | 202000173  |
| Brayan Alexander Mejia Barrientos  |  201900576   |  
## 2. Core del Negocio

## a. Descripción

La descripción debe ofrecer una visión clara del negocio de Qnave. Debe abarcar:

### Visión General de la Empresa
Qnave es una empresa de transporte privado en Guatemala que busca mejorar la seguridad y eficiencia en la coordinación de viajes entre usuarios y conductores mediante una solución tecnológica avanzada.

### Problemas Actuales
La empresa enfrenta problemas de seguridad debido a la delincuencia organizada que afecta tanto a usuarios como a conductores. Esto ha llevado a la pérdida de confianza y la competencia con otras empresas más seguras.

### Solución Propuesta
Modernizar las operaciones a través de una aplicación que mejore la seguridad y eficiencia, centralice la gestión de datos y ofrezca funcionalidades mejoradas para usuarios, conductores y administradores.

### Beneficios Esperados
- Reducción de incidentes de seguridad.
- Mejor experiencia para los usuarios.
- Mayor control sobre los conductores y asistentes.
- Un sistema de pago eficiente y seguro.

## b. Diagrama de CDU de Alto Nivel y su Primera Descomposición (CDU de Alto Nivel)

### Diagrama de CDU de Alto Nivel
Representa los principales procesos del sistema y sus interacciones a un nivel general. En el contexto de Qnave, este diagrama podría incluir:

- **Usuarios:** Solicitar viaje, registrar información, calificar conductor, pagar viaje.
- **Conductores:** Aceptar viaje, cancelar viaje, reportar problemas, modificar información.
- **Asistentes:** Gestionar registros, revisar documentos, asistir a conductores y usuarios.
- **Administrador:** Supervisar todo el sistema, gestionar usuarios y conductores, manejar problemas de seguridad.

### Primera Descomposición
Detalla los procesos principales del diagrama de alto nivel. Por ejemplo:

- **Solicitar Viaje:**
  - Usuario selecciona punto de partida y destino.
  - Sistema calcula tarifa.
  - Solicitud de viaje es enviada a los conductores disponibles.
  
- **Aceptar Viaje:**
  - Conductor recibe notificación.
  - Conductor acepta o rechaza el viaje.
  - Confirmación de viaje al usuario.

## 5. Matrices de Trazabilidad
Las matrices de trazabilidad ayudan a asegurar que todos los requerimientos están cubiertos por los elementos de diseño y los stakeholders están correctamente identificados. Aquí se detallan las matrices:

### a. Stakeholders vs Requerimientos
Objetivo: Asegurar que los requerimientos del sistema están alineados con las necesidades de todos los stakeholders.

| Requerimiento             | Stakeholder(s)        |
|---------------------------|-----------------------|
| Registro de usuario        | Usuario, Administrador|
| Calificación de conductor  | Usuario, Conductor    |
| Gestión de conductores     | Administrador, Asistentes |
| Reporte de problemas       | Usuario, Conductor    |

### b. Stakeholders vs CDU
Objetivo: Asegurar que todos los procesos en el Diagrama de CDU están alineados con las necesidades y roles de los stakeholders.

| CDU Proceso                | Stakeholder(s)        |
|----------------------------|-----------------------|
| Solicitar Viaje             | Usuario               |
| Aceptar Viaje               | Conductor             |
| Gestión de Registros        | Administrador, Asistentes |
| Reporte de Problemas        | Usuario, Conductor    |

### c. Requerimiento vs CDU
Objetivo: Verificar que cada requerimiento se cubre adecuadamente en el Diagrama de CDU.

| Requerimiento             | CDU Proceso            |
|---------------------------|------------------------|
| Registro de usuario        | Solicitar Viaje, Gestión de Registros |
| Calificación de conductor  | Finalizar Viaje        |
| Gestión de conductores     | Aceptar Viaje, Modificar Información |
| Reporte de problemas       | Reporte de Problemas   |

## 8. Diagrama de Despliegue de la Arquitectura

Este diagrama ilustra la distribución física de los componentes del sistema en la infraestructura de hardware. En el caso de Qnave, se podría representar así:

### Componentes Principales:

- **Servidor de Aplicación:** Hospeda la aplicación web y la lógica de negocio.
- **Servidor de Base de Datos:** Almacena toda la información de usuarios, conductores, viajes, etc.
- **Servidor de Correo Electrónico:** Envía notificaciones y confirmaciones por correo.
- **Dispositivos de Usuario:** Smartphones, tablets y computadoras que los usuarios y conductores utilizan para interactuar con la aplicación.

### Conexiones:

- **Aplicación Web <-> Servidor de Base de Datos:** Comunicación para consultas y actualizaciones de datos.
- **Aplicación Web <-> Servidor de Correo Electrónico:** Envío de notificaciones y confirmaciones.
- **Usuarios/Conductores <-> Aplicación Web:** Interacción a través de interfaces de usuario.

Este diagrama ayuda a visualizar cómo se distribuyen los componentes del sistema y cómo se comunican entre sí, asegurando una correcta implementación y operación del sistema.

