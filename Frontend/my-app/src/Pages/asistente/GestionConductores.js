import React, { useState } from "react";

import Navbar from "../../Components/Navbar";
import TablaUsuarios from "../../Components/asistente/TablaUsuarios";

const GestionConductores = () => {
    const [users, setUsers] = useState([
        { nombre: 'Juan Pérez', email: 'juan.perez@example.com', rol: 'Conductor', estado: 'Activo' },
        { nombre: 'María López', email: 'maria.lopez@example.com', rol: 'Conductor', estado: 'Inactivo' },
        // Más registros pueden añadirse aquí
    ]);

    const handleEdit = (user) => {
        // Lógica para editar el usuario
        console.log('Editando usuario:', user);
    };

    const handleDeactivate = (user) => {
        // Lógica para desactivar el usuario
        setUsers(users.map(u =>
            u.email === user.email ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
        ));
    };

    const handleDelete = (user) => {
        // Lógica para eliminar el usuario
        setUsers(users.filter(u => u.email !== user.email));
    };

    return (
        <>
            <Navbar rol="Asistente"/>
            <div className="container my-5">
                <div className="admin-container bg-white shadow rounded p-4">
                    <h1 className="text-center mb-4">Gestión de Conductores</h1>

                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-75"
                            placeholder="Buscar usuario por nombre o correo electrónico."
                        />
                    </div>

                    <TablaUsuarios
                        users={users}
                        handleEdit={handleEdit}
                        handleDeactivate={handleDeactivate}
                        handleDelete={handleDelete}
                    />

                    <button className="btn btn-dark w-100 mt-4">
                        Agregar Nuevo Conductor
                    </button>
                </div>
            </div>
        </>
    );
}

export default GestionConductores;