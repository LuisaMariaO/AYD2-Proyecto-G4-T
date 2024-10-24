import { React, useState } from 'react';
import Service from '../../Services/service';
import Swal from 'sweetalert2';
import Rating from '@mui/material/Rating';



const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO); // Convertir la fecha de formato ISO a objeto Date
    const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (agregar 1 porque los meses son indexados desde 0)
    const año = fecha.getFullYear(); // Obtener el año

    return `${dia}/${mes}/${año}`; // Formato día/mes/año
};



function ViajesPendientes({ viajesPendientes }) {
    const user_id = localStorage.getItem('user_id');
    const [tiempo_espera, setTiempoEspera] = useState(true);
    const [no_conductor, setNoConductor] = useState(false);
    const [otro, setOtro] = useState(false);
    const [comentario, setComentario] = useState('');
    const [motivo, setMotivo] = useState('1');
    const [viaje_id, setViajeId] = useState(0);
    const [viaje, setViaje] = useState([]);
    const [calificacion_conductor, setCalificacionConductor] = useState(0);

    const handleChangeMotivo = (e) => {
        setMotivo(e.target.value);
        console.log(e.target.value);
        if (e.target.value == '1') {
            setTiempoEspera(true);
            setNoConductor(false);
            setOtro(false);
        } else if (e.target.value == '2') {
            setNoConductor(true);
            setTiempoEspera(false);
            setOtro(false);
        }
        else {
            setOtro(true);
            setTiempoEspera(false);
            setNoConductor(false);
        }
    }

    const handleChangeComentario = (e) => {
        setComentario(e.target.value);
    }


    const handleCancelarViaje = (viaje_id) => {
        console.log(tiempo_espera, no_conductor, otro, comentario);
        Service.cancelarViaje(viaje_id, tiempo_espera, no_conductor, otro, comentario, user_id)
            .then(({ message }) => {
                Swal.fire({
                    title: '¡Viaje cancelado!',
                    text: "¡Vuelve pronto!",
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.reload();
                    setTiempoEspera(false);
                    setNoConductor(false);
                    setOtro(false);
                });

            })
            .catch((error) => {
                throw error
            })


    }

    const handleGetCalificacionConductor = (conductor_id) => {
        Service.obtenerCalificacionConductor(conductor_id)
            .then(({ data }) => {
                console.log(data.calificacion);
                if (data.calificacion) {
                    setCalificacionConductor(parseFloat(data.calificacion));
                } else {
                    setCalificacionConductor(0)
                }

            })
            .catch((error) => {
                throw error
            })
    }


    return (
        <>
            <div className="container">
                <div className="row">
                    {/* Mapea la lista de viajesPendientes */}
                    {viajesPendientes.map((viaje, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card my-3">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Viaje del <span>{formatearFecha(viaje.fecha)}</span>
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
                                                <strong>Tarifa:</strong> Q{viaje.precio}.00
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
                                        &nbsp;
                                        <div className='col-md-12 text-center'>
                                            <p className='card-footer text-center'>
                                                {(viaje.estado === 2) && (
                                                    <button className="btn btn-primary btn-sm float-start" data-bs-toggle="modal" data-bs-target="#infoConductorModal" onClick={() => {
                                                        handleGetCalificacionConductor(viaje.usuario_conductor);
                                                        setViaje(viaje);
                                                    }}>
                                                        Ver información del conductor

                                                    </button>
                                                )}

                                                <button className="btn btn-danger btn-sm float-end" data-bs-toggle="modal" data-bs-target="#reportarProblemaModal" onClick={() => setViajeId(viaje.viaje_id)}>Cancelar</button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Modal para cancelar viaje un problema */}
            <div className="modal fade" id="reportarProblemaModal" tabIndex="-1" aria-labelledby="reportarProblemaLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reportarProblemaLabel">Reportar Problema</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="razonProblema" className="form-label">Seleccione el problema:</label>
                                    <select className="form-select" id="razonProblema" onChange={handleChangeMotivo}>
                                        <option value="1">Tiempo de espera prolongado</option>
                                        <option value="2">Ningún conductor aceptó el viaje</option>
                                        <option value="3">Otro problema</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="comentarios" className="form-label">Comentarios:</label>
                                    <textarea className="form-control" id="comentarios" rows="3" placeholder="Escriba un comentario..." onChange={handleChangeComentario}></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleCancelarViaje(viaje_id)}>Enviar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver información del conductor */}
            <div className="modal fade" id="infoConductorModal" tabIndex="-1" aria-labelledby="infoConductorLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="infoConductorLabel">Información del Conductor</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {viaje ? (
                                <>
                                    <p><strong>Nombre del Conductor:</strong> {viaje.nombre}</p>
                                    <p><strong>Placa del Vehículo:</strong> {viaje.placa}</p>
                                    <p><strong>Marca del Vehículo:</strong> {viaje.marca_nombre}</p>
                                    <img src={viaje.fotografia} alt="Fotografía del vehículo" className="img-fluid" />
                                    <p>
                                        <strong>Calificación:</strong>
                                        <Rating
                                            name="read-only"
                                            value={calificacion_conductor}
                                            precision={0.5}
                                            readOnly
                                            style={{ verticalAlign: 'middle' }}
                                        />
                                        ({calificacion_conductor})
                                    </p>
                                </>
                            ) : (
                                <p>No hay información del conductor disponible.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );

}

export default ViajesPendientes;
