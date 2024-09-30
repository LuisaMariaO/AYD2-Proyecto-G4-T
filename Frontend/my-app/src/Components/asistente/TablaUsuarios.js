import React from "react";

const TablaUsuarios = ({ users, handleEdit, handleDeactivate, handleDelete }) => {

    return (
        <>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo Electrónico</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.nombre}</td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
                            <td>{user.estado}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary" onClick={() => handleEdit(user)}>
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleDeactivate(user)}
                                        disabled={user.estado === 'Inactivo'}
                                    >
                                        {user.estado === 'Activo' ? 'Dar de baja' : 'De baja'}
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(user)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>);
}

export default TablaUsuarios;