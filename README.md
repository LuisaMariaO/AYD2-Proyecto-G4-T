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

# Diagrama de Casos de Uso de Alto Nivel para Qnave

Este diagrama representa los principales procesos del sistema y sus interacciones a un nivel general en el contexto de Qnave.

## Actores y Casos de Uso

### Usuarios
- **Solicitar Viaje**  
  El usuario inicia una solicitud de viaje.  
  - **Relaciones**:  
    - `<<include>>` con **Calcular Tarifa**: El cálculo de la tarifa es una parte obligatoria al solicitar un viaje.
    - `<<include>>` con **Enviar Solicitud a Conductores**: Enviar la solicitud a los conductores disponibles es necesario para completar la solicitud del viaje.

- **Calificar Conductor**  
  Después de completar un viaje, el usuario puede calificar al conductor.  
  - **Relaciones**: No lleva ninguna relación `<<include>>` o `<<extend>>` porque es una función principal e independiente.

- **Pagar Viaje**  
  El usuario realiza el pago al finalizar el viaje.  
  - **Relaciones**:  
    - `<<include>>` con **Confirmar Pago**: El proceso de pago necesariamente incluye la confirmación del mismo.
    - `<<extend>>` con **Generar Recibo**: La generación del recibo es opcional y ocurre después de la confirmación del pago.

### Conductores
- **Aceptar Viaje**  
  El conductor recibe una solicitud de viaje y la acepta.  
  - **Relaciones**:  
    - `<<include>>` con **Confirmar Viaje al Usuario**: Aceptar el viaje incluye confirmar al usuario que el viaje ha sido aceptado.

- **Cancelar Viaje**  
  El conductor decide cancelar un viaje previamente aceptado.  
  - **Relaciones**:  
    - `<<extend>>` con **Aceptar Viaje**: La cancelación es una extensión de lo que podría suceder después de aceptar un viaje.

### Asistentes
- **Gestionar Registros**  
  El asistente gestiona y actualiza los registros de usuarios y conductores.  
  - **Relaciones**:  
    - `<<include>>` con **Revisar Documentos**: Gestionar registros incluye la revisión de los documentos.

- **Revisar Documentos**  
  El asistente revisa los documentos de los usuarios y conductores.  
  - **Relaciones**:  
    - Es un caso de uso individual, por lo que no lleva relaciones `<<include>>` o `<<extend>>`.

- **Asistir a Conductores y Usuarios**  
  El asistente proporciona ayuda o soporte a conductores y usuarios.  
  - **Relaciones**:  
    - `<<include>>` con **Gestionar Registros**: Asistir a conductores y usuarios incluye la gestión de registros y documentación.

### Administrador
- **Manejar Problemas de Seguridad**  
  El administrador interviene en situaciones que involucran la seguridad del sistema.  
  - **Relaciones**:  
    - `<<include>>` con **Bloquear Usuario o Conductor**: Manejar problemas de seguridad puede incluir bloquear a un usuario o conductor.
    - `<<extend>>` con **Generar Reporte de Incidente**: Generar un reporte de incidente es una extensión que puede seguir después de manejar un problema de seguridad.

## Descomposición de Casos de Uso

### Solicitar Viaje
1. **Usuario selecciona punto de partida y destino**  
   Este es el primer paso del proceso de solicitar un viaje.  
   - **Relaciones**: No lleva ninguna relación `<<include>>` o `<<extend>>` porque es una actividad básica del caso de uso principal.

2. **Calcular Tarifa**  
   El sistema calcula la tarifa del viaje basado en el punto de partida y destino seleccionados.  
   - **Relaciones**:  
     - `<<include>>` con **Solicitar Viaje**: Calcular la tarifa es una parte integral de solicitar un viaje.

3. **Enviar Solicitud a Conductores**  
   La solicitud se envía a los conductores disponibles para que la acepten.  
   - **Relaciones**:  
     - `<<include>>` con **Solicitar Viaje**: Enviar la solicitud a los conductores es parte necesaria del proceso de solicitud.

### Aceptar Viaje
1. **Conductor recibe notificación**  
   El conductor recibe una notificación de una nueva solicitud de viaje.  
   - **Relaciones**:  
     - `<<include>>` con **Aceptar Viaje**: Recibir la notificación es un paso necesario para aceptar el viaje.

2. **Conductor acepta o rechaza el viaje**  
   El conductor decide si acepta o rechaza la solicitud.  
   - **Relaciones**: No lleva ninguna relación `<<include>>` o `<<extend>>` porque es la acción principal del caso de uso.

3. **Confirmar Viaje al Usuario**  
   El sistema confirma al usuario que su viaje ha sido aceptado.  
   - **Relaciones**:  
     - `<<include>>` con **Aceptar Viaje**: Confirmar al usuario es parte necesaria del proceso de aceptar el viaje.

### Diagrama CDU extendido
A continuaicon se muestra una imagen del diagrama de casos de uso extendido.
![Diagrama CDU ](./Imagenes/Casos de uso Fase 1.drawio)  
De no ser posible la visualizacion correcta abra el siguiente link:  
[Diagrama de casos de uso expandido (CDU)](https://drive.google.com/file/d/1C2ZjXQ7WkfcIYpbFYBW3_Md_Gb1_05qC/view?usp=sharing)  

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

