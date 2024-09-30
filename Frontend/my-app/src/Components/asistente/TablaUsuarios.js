import React from "react";

const TablaUsuarios = ({ users }) => {

    // Función para traducir el estado de cuenta numérico a una descripción legible
    const getEstadoCuenta = (estado) => {
        switch (estado) {
            case 1:
                return 'No activado';
            case 2:
                return 'Activado';
            case 3:
                return 'Suspendido';
            case 4:
                return 'De baja';
            default:
                return 'Desconocido';
        }
    };

    // Función para cambiar el estado de la cuenta del usuario (dar de baja o activar)
    const handleEstadoCuenta = (usuario_id, nuevoEstado) => {
        fetch('http://localhost:9000/asistente/baja-activar-cuenta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario_id, nuevoEstado })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Estado de cuenta actualizado exitosamente.');
                    alert('Estado de cuenta actualizado exitosamente.');
                } else {
                    console.error('Error al actualizar el estado de la cuenta.');
                    alert('Error al cambiar el estado de la cuenta.');
                }
            })
            .catch(error => {
                console.error('Error en la conexión:', error);
            });
    };

    return (
        <>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Correo Electrónico</th>
                        <th>Celular</th>
                        <th>Dirección</th>
                        <th>Edad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>{user.nombre}</td>
                                <td>{user.correo}</td>
                                <td>{user.celular}</td>
                                <td>{user.direccion}</td>
                                <td>{user.edad}</td>
                                <td>{getEstadoCuenta(user.estado_cuenta)}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary">
                                            Ver
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            disabled={user.estado_cuenta === 3} // Deshabilitar si el estado es Suspendido
                                            onClick={() =>
                                                handleEstadoCuenta(user.usuario_id, user.estado_cuenta === 4 ? 2 : 4)
                                            }
                                        >
                                            {/* Si el usuario está de baja (estado 4), mostrar "Activar", de lo contrario "Dar de baja" */}
                                            {user.estado_cuenta === 4 ? 'Activar' : 'Dar de baja'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No hay usuarios disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default TablaUsuarios;
