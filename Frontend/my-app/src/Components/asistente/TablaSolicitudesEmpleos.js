import React from "react";

const TablaSolicitudesEmpleos = ({ drivers, viewCV }) => {

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
                    {drivers.map((driver, index) => (
                        <tr key={index}>
                            <td>User 1</td>
                            <td>{driver.nombre}</td>
                            <td>Tipo de carro</td>
                            <td>Placa 1</td>
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