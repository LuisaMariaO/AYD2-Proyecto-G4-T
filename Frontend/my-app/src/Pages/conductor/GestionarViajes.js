import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";
import ReactStars from 'react-rating-stars-component';

function GestionarViajes() {
    const [viajes, setViajes] = useState([]);
    const [viajeEnCurso, setViajeEnCurso] = useState(null);
    const [usuarioInfo, setUsuarioInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');
    const [calificacion, setCalificacion] = useState(5); // Calificación por defecto
    const [pagoRecibido, setPagoRecibido] = useState(null);
    const [comentarioManual, setComentarioManual] = useState('');
    const conductorId = localStorage.getItem('conductorId');
    const [cancelaciones, setCancelaciones] = useState(0);

    useEffect(() => {
        const fetchViajes = async () => {
            if (!viajeEnCurso) {
                const response = await fetch('http://localhost:9000/conductor/viajesDisponibles');
                const result = await response.json();
                setViajes(result);
            }
        };

        const intervalId = setInterval(fetchViajes, 1000);
        return () => clearInterval(intervalId);
    }, [viajeEnCurso]);

    useEffect(() => {
        const storedCancelaciones = localStorage.getItem(`cancelaciones_${conductorId}`);
        setCancelaciones(storedCancelaciones ? parseInt(storedCancelaciones, 10) : 0);
    }, [conductorId]);

    const mostrarInformacionUsuario = async (usuarioId) => {
        try {
            const response = await fetch(`http://localhost:9000/conductor/informacionUsuario/${usuarioId}`);
            const result = await response.json();
    
            if (result.status === 'success') {
                setUsuarioInfo(result.data);
                setShowModal(true);
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
            Swal.fire('Error', 'Ocurrió un error al obtener la información del usuario.', 'error');
        }
    };

    const aceptarViaje = async (viajeId, usuarioId) => {
        try {
            const response = await fetch(`http://localhost:9000/conductor/aceptarViaje/${viajeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conductorId })
            });
    
            const result = await response.json();
    
            if (result.status === 'success') {
                setViajeEnCurso(viajeId);
                sessionStorage.setItem('usuarioId', usuarioId);
                Swal.fire('Viaje aceptado', 'Has aceptado el viaje correctamente.', 'success');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al aceptar viaje:', error);
            Swal.fire('Error', 'Ocurrió un error al aceptar el viaje.', 'error');
        }
    };

    const cancelarViaje = async () => {
        if (!motivoCancelacion) {
            return Swal.fire('Error', 'Por favor, ingresa un motivo de cancelación.', 'error');
        }

        try {
            const response = await fetch(`http://localhost:9000/conductor/cancelarViaje/${viajeEnCurso}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conductorId, motivo: motivoCancelacion })
            });

            const result = await response.json();

            if (result.status === 'success') {
                const updatedCancelaciones = cancelaciones + 1;
                setCancelaciones(updatedCancelaciones);
                localStorage.setItem(`cancelaciones_${conductorId}`, updatedCancelaciones);

                setViajeEnCurso(null);
                setMotivoCancelacion('');

                if (updatedCancelaciones >= 10) {
                    Swal.fire('Cuenta bloqueada', 'Has cancelado más de 10 viajes en un día. Tu cuenta ha sido bloqueada.', 'error');
                } else {
                    Swal.fire('Viaje cancelado', 'El viaje ha sido cancelado correctamente.', 'success');
                }
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al cancelar viaje:', error);
            Swal.fire('Error', 'Ocurrió un error al cancelar el viaje.', 'error');
        }
    };

    const finalizarViaje = async () => {
        if (pagoRecibido === null) {
            return Swal.fire('Error', 'Por favor, confirma si se recibió el pago.', 'error');
        }
    
        const usuarioId = sessionStorage.getItem('usuarioId');
    
        if (!usuarioId) {
            return Swal.fire('Error', 'No se pudo obtener la información del usuario.', 'error');
        }
    
        try {
            const response = await fetch(`http://localhost:9000/conductor/finalizarViaje/${viajeEnCurso}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conductorId, pagoRecibido, calificacion, comentarioManual, usuarioId })
            });
    
            const result = await response.json();
    
            if (result.status === 'success') {
                setViajeEnCurso(null);
                Swal.fire('Viaje finalizado', 'El viaje ha sido finalizado correctamente.', 'success');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al finalizar viaje:', error);
            Swal.fire('Error', 'Ocurrió un error al finalizar el viaje.', 'error');
        }
    };

    const onStarClick = (nextValue) => {
        setCalificacion(nextValue);
    };

    return (
        <>
            <Navbar rol="Conductor" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar />
                    <div className="col py-3 px-3 pt-3">
                        <h1>Gestionar Viajes</h1>
                        <div className="viajes-disponibles mt-4">
                            {viajeEnCurso ? (
                                <>
                                    <h2>Viaje en Progreso</h2>
                                    <p><strong>Viaje ID:</strong> {viajeEnCurso}</p>

                                    <div className="form-group mt-3">
                                        <label>¿Se recibió el pago?</label>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="pagoRecibidoSi"
                                                name="pagoRecibido"
                                                value="true"
                                                onChange={() => setPagoRecibido(true)}
                                            />
                                            <label className="form-check-label" htmlFor="pagoRecibidoSi">
                                                Sí
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="pagoRecibidoNo"
                                                name="pagoRecibido"
                                                value="false"
                                                onChange={() => setPagoRecibido(false)}
                                            />
                                            <label className="form-check-label" htmlFor="pagoRecibidoNo">
                                                No
                                            </label>
                                        </div>
                                    </div>

                                    {pagoRecibido && (
                                        <div className="form-group mt-3">
                                            <label htmlFor="calificacion">Calificación del Usuario:</label>
                                            {/* Componente de calificación por estrellas */}
                                            <ReactStars
                                                count={5}
                                                value={calificacion}
                                                onChange={onStarClick}
                                                size={24}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                    )}

                                    {pagoRecibido && (
                                        <div className="form-group mt-3">
                                            <label htmlFor="comentario">Comentario (opcional):</label>
                                            <textarea
                                                id="comentario"
                                                className="form-control"
                                                value={comentarioManual}
                                                onChange={(e) => setComentarioManual(e.target.value)}
                                                placeholder="Escribe un comentario sobre el usuario..."
                                            />
                                        </div>
                                    )}

                                    <button className="btn btn-success mt-3" onClick={finalizarViaje}>
                                        Finalizar Viaje
                                    </button>

                                    <div className="form-group mt-3">
                                        <label htmlFor="motivo">Motivo de Cancelación (opcional):</label>
                                        <textarea
                                            id="motivo"
                                            className="form-control"
                                            value={motivoCancelacion}
                                            onChange={(e) => setMotivoCancelacion(e.target                                            .value)}
                                            placeholder="Describe el motivo de cancelación..."
                                            />
                                            </div>
        
                                            <button className="btn btn-danger mt-3" onClick={cancelarViaje}>
                                                Cancelar Viaje
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h2>Viajes disponibles</h2>
                                            {viajes.length === 0 && <p>No hay viajes disponibles en este momento.</p>}
                                            {viajes.length > 0 && (
                                                <ul className="list-group">
                                                    {viajes.map((viaje) => (
                                                        <li key={viaje.viaje_id} className="list-group-item d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>Fecha:</strong> {viaje.fecha}<br />
                                                                <strong>Pago:</strong> {viaje.metodo_pago === 'T' ? 'Tarjeta' : 'Efectivo'}<br />
                                                                <strong>Lugar de inicio:</strong> Zona {viaje.inicio}<br />
                                                                <strong>Lugar de finalización:</strong> Zona {viaje.fin}<br />
                                                                <strong>Precio:</strong> Q{viaje.precio}<br />
                                                            </div>
                                                            <div>
                                                                <button className="btn btn-info mx-1" onClick={() => mostrarInformacionUsuario(viaje.usuario_solicitud)}>
                                                                    Mostrar Información del Usuario
                                                                </button>
                                                                <button className="btn btn-primary" onClick={() => aceptarViaje(viaje.viaje_id, viaje.usuario_solicitud)}>
                                                                    Aceptar
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
        
                    {/* Modal para mostrar la información del usuario */}
                    {showModal && usuarioInfo && (
                        <div className="modal d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Información del Usuario</h5>
                                        <button type="button" className="close" onClick={() => setShowModal(false)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <strong>Nombre:</strong> {usuarioInfo.nombre || 'Desconocido'}<br />
                                            <strong>Celular:</strong> {usuarioInfo.celular || 'No disponible'}<br />
                                            
                                            <strong>Calificación General:</strong>
                                            {usuarioInfo.calificacion_general && !isNaN(usuarioInfo.calificacion_general) ? (
                                                <div>
                                                    <ReactStars
                                                        count={5}
                                                        value={parseFloat(usuarioInfo.calificacion_general)}
                                                        edit={false}
                                                        size={24}
                                                        activeColor="#ffd700"
                                                    />
                                                </div>
                                            ) : (
                                                'No disponible'
                                            )}
                                            <br />
        
                                            <strong>Viajes Completados:</strong> {usuarioInfo.viajes_completados || 0}<br />
                                            <strong>Comentarios:</strong>
                                            <ul>
                                                {usuarioInfo.comentarios.length > 0 ? (
                                                    usuarioInfo.comentarios.map((comentario, index) => (
                                                        <li key={index}>
                                                            {comentario.comentario || 'Sin comentario'}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No hay comentarios.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        }
        
        export default GestionarViajes;
        
                                       
