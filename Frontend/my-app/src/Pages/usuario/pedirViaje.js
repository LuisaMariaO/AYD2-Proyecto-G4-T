import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarUsuario";
import Service from "../../Services/service";
import Swal from 'sweetalert2';
import io from 'socket.io-client';
import ViajesPendientes from "./viajesPendientes";
import Rating from '@mui/material/Rating';
import Modal from 'bootstrap/js/dist/modal';


function PedirViaje() {
    window.bootstrap = require('bootstrap');
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    const [esConductor, setEsConductor] = useState(true);
    const [tarifa, setTarifa] = useState(0);
    const [tarifas, setTarifas] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [partida, setPartida] = useState(0);
    const [destino, setDestino] = useState(0);
    const [viajeActivo, setViajeActivo] = useState([]);
    const [viajesPendientes, setViajesPendientes] = useState([])
    const [viajeFinalizado, setViajeFinalizado] = useState(0);
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [destinos, setDestinos] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:9001');
        socket.on('connect', () => {
            console.log('Conectado al servidor');
        });
        // En caso de que ocurra un error de conexión
        socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });

        Service.obtenerZonas()
            .then(({ data }) => {
                setZonas(data)

            })
            .catch((error) => {
                throw error
            })

        Service.obtenerTarifas()
            .then(({ tarifas }) => {
                setTarifas(tarifas)

            })
            .catch((error) => {
                throw error
            })

            Service.obtenerDestinos()
            .then(({ data }) => {

                setDestinos(data)

            })
            .catch((error) => {
                throw error
            })

        Service.obtenerViajesPendientes(user_id)
            .then(({ viajes }) => {
                const viajesFiltrados = viajes.filter(viaje => viaje.usuario_solicitud == user_id);
                setViajesPendientes(viajesFiltrados);

            })
            .catch((error) => {
                throw error
            })



        socket.on('actualizacionViajesUsusario', (viajes) => {
            // Filtrar los viajes pendientes del usuario actual
            const viajesFiltrados = viajes.filter(viaje => viaje.usuario_solicitud == user_id);
            setViajesPendientes(viajesFiltrados);

        });

        socket.on('viajeFinalizado', (viaje) => {
            setViajeFinalizado(viaje.viajeId);
            const modalElement = document.getElementById('calificarViajeModal');
            const modalInstance = new window.bootstrap.Modal(modalElement);
            modalInstance.show(); // Abre el modal
        });

        // Limpiar el socket cuando el componente se desmonte
        return () => {
            socket.off('actualizacionViajesUsusario');
        };
    }, []);

    const handleChangePartida = (e) => {
        setPartida(e.target.value);


        setTarifa(obtenerPrecio(e.target.value, destino))
    };

    const handleChangeDestino = (e) => {
        setDestino(e.target.value);

        setTarifa(obtenerPrecio(partida, e.target.value))
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        Service.solicitarViaje(user_id, partida, destino, tarifa)
            .then(({ message }) => {

                Swal.fire({
                    title: "¡Viaje solicitado!",
                    text: "Espera mientras un conductor acepta tu viaje",
                    icon: "success"
                }).then(() => {
                    limpiarFormulario()
                });

            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al solicitar el viaje, por favor intente más tarde",
                    icon: "error"
                });
            })
    };

    const limpiarFormulario = () => {
        setPartida(0);
        setDestino(0);
        setTarifa(0);
    }

    const obtenerPrecio = (zonaInicio, zonaFin) => {
        const tarifa = tarifas.find(t => t.inicio == zonaInicio && t.fin == zonaFin);
        return tarifa ? tarifa.precio : 0;
    };

    const handleCalificar = () => {
       
        Service.calificarViaje(viajeFinalizado, calificacion, comentario)
        .then(({ message }) => {

            Swal.fire({
                title: "¡Viaje calificado!",
                text: "Gracias por viajar con QNave :3",
                icon: "success"
            }).then(() => {
                window.location.reload();
            });

        })
        .catch((error) => {
            console.log(error)
        })
    };
    return (
        <>
            <Navbar rol="Usuario" />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <div className="col">
                        <div className="py-3 px-3 pt-3">
                            {viajesPendientes.length === 0 ? (
                                <>
                                    <h2 className="text-center">Solicitar viaje</h2>
                                    <div className="container mt-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="tipo" className="form-label">Punto de partida</label>
                                                <select
                                                    className="form-select"
                                                    id="partida"
                                                    name="partida"
                                                    onChange={handleChangePartida}
                                                    value={partida}
                                                >
                                                    <option value="">Seleccione el punto de partida</option>
                                                    {zonas.map((partida) => (
                                                        <option key={partida.zona} value={partida.zona}>
                                                            Zona {partida.zona}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="tipo" className="form-label">Destino</label>
                                                <select
                                                    className="form-select"
                                                    id="destino"
                                                    name="destino"
                                                    onChange={handleChangeDestino}
                                                    //value={destino}
                                                >
                                                    <option value="">Seleccione el destino</option>
                                                    {destinos.map((destino) => (
                                                        <option key={destino.nombre} value={destino.zona}>
                                                            {destino.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <p>Tarifa: {tarifa > 0 ? `Q${tarifa}` : "No disponible"}</p>

                                            <button type="submit" className="btn btn-success">Pedir viaje</button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <>

                                    <div className="alert alert-warning">
                                        <h2>Viajes pendientes</h2>
                                    </div>
                                    <ViajesPendientes viajesPendientes={viajesPendientes} />
                                </>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para calificar un viaje recién finalizado */}
            <div className="modal fade" id="calificarViajeModal" tabIndex="-1" aria-labelledby="infoCalificarLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="infoCalificarLabel">¡Viaje finalizado!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <strong>Calificación:</strong>
                            <p>
                            <Rating
                                name="simple-controlled"
                                value={calificacion}
                                onChange={(event, newValue) => {
                                    setCalificacion(newValue);
                                }}
                            />
                            </p>
                            <strong>Comentario: </strong>(Opcional)
                            <textarea
                                className="form-control"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            ></textarea>
                            <br></br>
                            <button type="button" className="btn btn-success" onClick={handleCalificar}>Calificar</button>
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

export default PedirViaje;