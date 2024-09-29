import React from "react";

import Navbar from "../../Components/Navbar";
import TablaSolicitudesEmpleos from "../../Components/asistente/TablaSolicitudesEmpleos";

const SolicitudesEmpleos = () => {

    const drivers = [
        { nombre: 'Juan Pérez', foto: 'juan.jpg', estado: 'Pendiente', cv: 'juan_cv.pdf' },
        { nombre: 'Luis Chay', foto: 'luis.jpg', estado: 'Rechazado', cv: 'maria_cv.pdf' },
        { nombre: 'María López', foto: 'maria.jpg', estado: 'Aprobado', cv: 'maria_cv.pdf' }
    ];

    const viewCV = (cvFile) => {
        window.open(cvFile, '_blank');
    };

    return (
        <>
            <Navbar rol="Asistente" />
            <div className="container my-5">
                <div className="cv-container bg-white shadow rounded p-4">
                    <h1 className="text-center mb-4">Visualización de CVs de Conductores</h1>

                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-75"
                            placeholder="Buscar conductor por nombre..."
                        />
                        <select className="form-select w-25">
                            <option value="">Filtrar por estado</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="rechazado">Rechazado</option>
                        </select>
                    </div>
                    <TablaSolicitudesEmpleos drivers={drivers} viewCV={viewCV} />
                </div>
            </div>
        </>
    );
}

export default SolicitudesEmpleos;