import React from "react";

const TablaSolicitudesEmpleos = ({ drivers, viewCV }) => {

    return (
        <>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Foto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver, index) => (
                        <tr key={index}>
                            <td>{driver.nombre}</td>
                            <td><img src={driver.foto} alt={`Foto de ${driver.nombre}`} width="50" /></td>
                            <td>{driver.estado}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary" onClick={() => viewCV(driver.cv)}>
                                        Ver CV
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        disabled={driver.estado === 'Aprobado'}
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        disabled={driver.estado === 'Rechazado'}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TablaSolicitudesEmpleos;