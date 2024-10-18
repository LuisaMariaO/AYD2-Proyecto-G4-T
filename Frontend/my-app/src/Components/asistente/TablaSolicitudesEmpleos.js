import React from "react";

const TablaSolicitudesEmpleos = ({ drivers, viewCV }) => {

    const handleAprobar = (usuario_id) => {
        fetch('http://localhost:9000/asistente/aprobar-solicitud-empleo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id }) // Enviar el usuario_id en el cuerpo de la solicitud
        })
            .then(response => {
                if (response.ok) {
                    // La solicitud se realizó correctamente
                    console.log('Solicitud de empleo aprobada exitosamente.');
                } else {
                    console.error('Error al aprobar la solicitud de empleo.');
                }
            })
            .catch(error => {
                console.error('Error en la conexión:', error);
            });
    }

    const handleRechazar = (usuario_id) => {
        fetch('http://localhost:9000/asistente/rechazar-solicitud-empleo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id }) // Enviar el usuario_id en el cuerpo de la solicitud
        })
            .then(response => {
                if (response.ok) {
                    console.log('Solicitud de empleo rechazada exitosamente.');
                } else {
                    console.error('Error al rechazar la solicitud de empleo.');
                }
            })
            .catch(error => {
                console.error('Error en la conexión:', error);
            });
    }

    return (
        <>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Marca vehiculo</th>
                        <th>Placa</th>
                        <th>Estado CV</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Verificar si drivers es un array válido */}
                    {drivers && drivers.length > 0 ? (
                        drivers.map((driver, index) => (
                            <tr key={index}>
                                <td>{driver.nombre_usuario}</td>
                                <td>{driver.nombre_completo}</td>
                                <td>{driver.marca_vehiculo}</td>
                                <td>{driver.placa_vehiculo}</td>
                                <td>
                                    {driver.estado_cv === null && "Pendiente"}
                                    {driver.estado_cv === 0 && "Rechazado"}
                                    {driver.estado_cv === 1 && "Aprobado"}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary" onClick={() => viewCV(driver.curriculum)}>
                                            Ver CV
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={driver.estado_cv === 1}
                                            onClick={() => handleAprobar(driver.codigo_empleado)}
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            disabled={driver.estado_cv === 0}
                                            onClick={() => handleRechazar(driver.codigo_empleado)}
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No hay solicitudes de empleo disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default TablaSolicitudesEmpleos;