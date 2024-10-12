import React, { useState } from "react";

const TablaUsuarios = ({ users, tipoUsuario }) => {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [showEditModal, setShowEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición
    const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar la información del usuario seleccionado
    const [editUser, setEditUser] = useState(null); // Estado para almacenar la información a editar

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
                    alert('Estado de cuenta actualizado exitosamente.');
                } else {
                    alert('Error al cambiar el estado de la cuenta.');
                }
            })
            .catch(error => {
                console.error('Error en la conexión:', error);
            });
    };

    // Función para mostrar la información del usuario en el modal de ver
    const handleVerUsuario = (user) => {
        setSelectedUser(user); // Guardar el usuario seleccionado
        setShowModal(true); // Mostrar el modal de visualización
    };

    // Función para mostrar el modal de edición
    const handleEditarUsuario = (user) => {
        setEditUser({ ...user }); // Clonar la información del usuario para editar
        setShowEditModal(true); // Mostrar el modal de edición
    };

    // Función para cerrar el modal de ver información
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Función para cerrar el modal de edición
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditUser(null);
    };

    // Función para manejar el cambio en los campos de edición
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };

    // Función para guardar los cambios del usuario
    const handleGuardarCambios = () => {
        fetch(`http://localhost:9000/asistente/editar-conductor/${editUser.usuario_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editUser)
        })
        .then(response => response.json())
        .then(data => {
            alert("Información del conductor actualizada exitosamente.");
            setShowEditModal(false); // Cerrar el modal
        })
        .catch(error => {
            console.error("Error al actualizar la información del conductor", error);
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
                                        <button className="btn btn-primary" onClick={() => handleVerUsuario(user)}>
                                            Ver
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => handleEditarUsuario(user)}>
                                            Editar
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
                            X
                        </button>
                        <div className="d-flex">
                            <div className="w-75 overflow-auto">
                                <h2>Información del {tipoUsuario}</h2>
                                <p><strong>Usuario:</strong> {selectedUser.username}</p>
                                <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                                <p><strong>Correo Electrónico:</strong> {selectedUser.correo}</p>
                                <p><strong>Celular:</strong> {selectedUser.celular}</p>
                                <p><strong>Dirección:</strong> {selectedUser.direccion}</p>
                                <p><strong>Edad:</strong> {selectedUser.edad}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar la información del conductor */}
            {showEditModal && editUser && (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="close-button" onClick={closeEditModal}>
                            X
                        </button>
                        <h2>Editar Información del {tipoUsuario}</h2>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input type="text" className="form-control" name="nombre" value={editUser.nombre} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico:</label>
                            <input type="email" className="form-control" name="correo" value={editUser.correo} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Celular:</label>
                            <input type="text" className="form-control" name="celular" value={editUser.celular} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Dirección:</label>
                            <input type="text" className="form-control" name="direccion" value={editUser.direccion} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Edad:</label>
                            <input type="number" className="form-control" name="edad" value={editUser.edad} onChange={handleInputChange} />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-danger" onClick={closeEditModal}>
                                Cancelar
                            </button>
                            <button className="btn btn-success" onClick={handleGuardarCambios}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Estilos para los modales */}
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
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
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
            `}</style>
        </>
    );
};

export default TablaUsuarios;
