import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import TablaSolicitudesEmpleos from "../../Components/asistente/TablaSolicitudesEmpleos";

const SolicitudesEmpleos = () => {
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para búsqueda
    const [filterState, setFilterState] = useState(''); // Estado para filtro de estado

    const viewCV = (cvFile) => {
        if (cvFile) {
            window.open(cvFile, '_blank');
        } else {
            alert("El conductor no tiene un CV disponible.");
        }
    };

    useEffect(() => {
        fetch('http://localhost:9000/asistente/solicitudes-empleo')
            .then(response => response.json())
            .then(data => {
                // Verifica si data.data es un array
                if (Array.isArray(data.data)) {
                    setDrivers(data.data);
                } else {
                    setDrivers([]);
                }
            })
            .catch(error => {
                setDrivers([]);
            });
    }, []);

    // Función para filtrar y buscar conductores
    const filteredDrivers = drivers.filter(driver => {
        // Comprobamos si los campos existen antes de aplicar los filtros
        const matchesSearchTerm = (
            (driver.nombre_usuario && driver.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (driver.nombre_completo && driver.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Filtrar por estado: aprobados, pendientes o rechazados
        const matchesFilterState = filterState === '' ||
            (filterState === 'aprobado' && driver.estado_cv === 1) ||
            (filterState === 'pendiente' && driver.estado_cv === null) ||
            (filterState === 'rechazado' && driver.estado_cv === 0);

        return matchesSearchTerm && matchesFilterState;
    });

    return (
        <>
            <Navbar rol="Asistente" />
            <div className="container my-5">
                <div className="cv-container bg-white shadow rounded p-4">
                    <h1 className="text-center mb-4">Visualización de CVs de Conductores</h1>

                    <div className="d-flex justify-content-between mb-4">
                        {/* Búsqueda por nombre o usuario */}
                        <input
                            type="text"
                            className="form-control w-75"
                            placeholder="Buscar conductor por nombre o usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
                        />

                        {/* Filtro por estado */}
                        <select
                            className="form-select w-25"
                            value={filterState}
                            onChange={(e) => setFilterState(e.target.value)} // Actualizar el filtro de estado
                        >
                            <option value="">Filtrar por estado</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="rechazado">Rechazado</option>
                        </select>
                    </div>

                    {/* Pasar los conductores filtrados a la tabla */}
                    <TablaSolicitudesEmpleos drivers={filteredDrivers} viewCV={viewCV} />
                </div>
            </div>
        </>
    );
}

export default SolicitudesEmpleos;