import React, { useState } from "react";

const TablaUsuarios = ({ users, tipoUsuario }) => {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar la información del usuario seleccionado

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

    // Función para mostrar la información del usuario en el modal
    const handleVerUsuario = (user) => {
        setSelectedUser(user); // Guardar el usuario seleccionado
        setShowModal(true); // Mostrar el modal
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
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
                                        <button className="btn btn-primary" onClick={() => handleVerUsuario(user)}>
                                            Ver
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            disabled={user.estado_cuenta === 3} // Deshabilitar si el estado es Suspendido
                                            onClick={() =>
                                                handleEstadoCuenta(user.usuario_id, user.estado_cuenta === 4 ? 2 : 4)
                                            }
                                        >
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

            {/* Modal para ver información del usuario */}
            {showModal && selectedUser && (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="close-button" onClick={closeModal}>
                            Cerrar
                        </button>

                        {/* Contenedor para la información y la imagen */}
                        <div className="d-flex">
                            {/* Contenedor para la información del usuario */}
                            <div className="w-75 overflow-auto">
                                <h2>Información del {tipoUsuario}</h2>

                                <p><strong>Usuario:</strong> {selectedUser.username}</p>
                                <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                                <p><strong>Correo Electrónico:</strong> {selectedUser.correo}</p>
                                <p><strong>Celular:</strong> {selectedUser.celular}</p>
                                <p><strong>Dirección:</strong> {selectedUser.direccion}</p>
                                <p><strong>Edad:</strong> {selectedUser.edad}</p>
                                <p><strong>Estado de Cuenta:</strong> {getEstadoCuenta(selectedUser.estado_cuenta)}</p>

                                {/* Información adicional como historial de viajes, calificaciones, etc. */}
                                <h3>Historial de Viajes</h3>
                                <ul>
                                    <li>Viaje 1</li>
                                    <li>Viaje 2</li>
                                </ul>

                                <h3>Calificaciones</h3>
                                <ul>
                                    <li>5 estrellas</li>
                                    <li>4 estrellas</li>
                                </ul>

                                <h3>Comentarios de Usuarios</h3>
                                <ul>
                                    <li>Excelente conductor, muy puntual.</li>
                                    <li>Buena experiencia, pero puede mejorar en la puntualidad.</li>
                                </ul>
                            </div>

                            {/* Contenedor para la foto */}
                            <div className="w-25 d-flex justify-content-center align-items-center">
                                {selectedUser.fotografia && (
                                    <img
                                        src={selectedUser.fotografia}
                                        alt="Foto del usuario"
                                        className="img-fluid rounded-circle"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Estilos para el modal y la imagen circular */}
            <style jsx>{`
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                }
                .overlay-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 10px;
                    width: 80%;
                    max-width: 900px;
                    max-height: 80vh; /* Limitar la altura del modal */
                    overflow-y: auto; /* Habilitar scroll en el modal */
                    position: relative;
                }
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    border-radius: 5px;
                }
                .img-fluid {
                    border-radius: 50%;
                }
                .w-75 {
                    max-height: 100%; /* Asegurarse de que la columna de texto no desborde */
                }
            `}</style>
        </>
    );
}

export default TablaUsuarios;
