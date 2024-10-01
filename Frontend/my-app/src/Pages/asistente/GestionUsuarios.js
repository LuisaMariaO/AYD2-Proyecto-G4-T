import React, { useState, useEffect } from "react";

import Navbar from "../../Components/Navbar";
import TablaUsuarios from "../../Components/asistente/TablaUsuarios";

const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda

    useEffect(() => {
        fetch('http://localhost:9000/asistente/usuarios')
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Registros obtenidos') {
                    setUsers(data.data);
                } else {
                    console.error('Error al obtener los usuarios:', data.message);
                }
            })
            .catch(error => {
                console.error('Error en la conexión:', error);
            });
    }, []);

    // Función para filtrar los usuarios en base al término de búsqueda
    const filteredUsers = users.filter(user => {
        // Asegurarse de que los campos no sean null o undefined antes de aplicar includes
        const username = user.username ? user.username.toLowerCase() : '';
        const nombre = user.nombre ? user.nombre.toLowerCase() : '';
        const correo = user.correo ? user.correo.toLowerCase() : '';
        const celular = user.celular ? user.celular.toString() : '';

        return (
            username.includes(searchTerm.toLowerCase()) ||
            nombre.includes(searchTerm.toLowerCase()) ||
            correo.includes(searchTerm.toLowerCase()) ||
            celular.includes(searchTerm)
        );
    });

    return (
        <>
            <Navbar rol="Asistente" />
            <div className="container my-5">
                <div className="admin-container bg-white shadow rounded p-4">
                    <h1 className="text-center mb-4">Gestión de Usuarios</h1>

                    {/* Campo de búsqueda */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-75"
                            placeholder="Buscar usuario por nombre, correo electrónico o celular."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
                        />
                    </div>

                    {/* Pasar los usuarios filtrados a la tabla */}
                    <TablaUsuarios
                        users={filteredUsers} tipoUsuario="usuario"/>

                    {/* <button className="btn btn-dark w-100 mt-4">
                        Agregar Nuevo Usuario
                    </button> */}
                </div>
            </div>
        </>
    );
}

export default GestionUsuarios;