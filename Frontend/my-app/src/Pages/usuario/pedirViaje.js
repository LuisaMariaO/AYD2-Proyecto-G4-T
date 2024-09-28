import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarUsuario";
import Service from "../../Services/service";
import Swal from 'sweetalert2';
import io from 'socket.io-client';


function PedirViaje() {
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    const [esConductor, setEsConductor] = useState(true);
    const [tarifa, setTarifa] = useState(0);
    const [tarifas, setTarifas] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [partida, setPartida] = useState(0);
    const [destino, setDestino] = useState(0);
    const [viajeActivo, setViajeActivo] = useState([]);

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



        socket.on('actualizacionViajesUsusario', (viajes) => {
        // Filtrar los viajes pendientes del usuario actual
            const viajesUsuario = viajes.filter(viaje => viaje.usuario_solicitud === user_id && viaje.estado === 1);
            setViajeActivo(viajesUsuario);
            console.log(viajes)
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
    return (
        <>
            <Navbar rol="Usuario" />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <div className="col">
                        <div className="py-3 px-3 pt-3 text-center">
                            <h2>Solicitar viaje</h2>
                        </div>
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
                                        <option value="">Seleccione el punto de partida</option> {/* Opción por defecto */}
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
                                        value={destino}
                                    >
                                        <option value="">Seleccione el destino</option> {/* Opción por defecto */}
                                        {zonas.map((destino) => (
                                            <option key={destino.zona} value={destino.zona}>
                                                Zona {destino.zona}
                                            </option>
                                        ))}

                                    </select>
                                </div>


                                <p>Tarifa: {tarifa > 0 ? `Q${tarifa}` : "No disponible"}</p>



                                <button type="submit" className="btn btn-success">Pedir viaje</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default PedirViaje;