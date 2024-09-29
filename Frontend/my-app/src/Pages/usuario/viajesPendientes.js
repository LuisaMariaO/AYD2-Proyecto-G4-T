import React from 'react';

const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO); // Convertir la fecha de formato ISO a objeto Date
    const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (agregar 1 porque los meses son indexados desde 0)
    const año = fecha.getFullYear(); // Obtener el año

    return `${dia}/${mes}/${año}`; // Formato día/mes/año
};

function ViajesPendientes({ viajesPendientes }) {
    return (
        <div className="container">
            <div className="row">
                {/* Mapea la lista de viajesPendientes */}
                {viajesPendientes.map((viaje, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="card my-3">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Viaje del <span className="text-primary">{formatearFecha(viaje.fecha)}</span>
                                </h5>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Inicio:</strong> Zona {viaje.inicio}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Destino:</strong> Zona {viaje.fin}
                                        </p>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Tarifa:</strong> Q{viaje.tarifa}.00
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text">
                                            <strong>Estado: </strong>
                                            <span className={`badge ${viaje.estado === 1 ? 'bg-warning' : 'bg-info'}`}>
                                                {viaje.estado === 1 ? 'Pendiente' : 'En curso'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViajesPendientes;
