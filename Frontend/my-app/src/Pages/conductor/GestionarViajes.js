import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";

function GestionarViajes() {
    const [viajes, setViajes] = useState([]);
    const [viajeAceptado, setViajeAceptado] = useState(null);
    const [pagoRecibido, setPagoRecibido] = useState(false);

    useEffect(() => {
        const fetchViajes = async () => {
            const response = await fetch('http://localhost:9000/viajesDisponibles');
            const result = await response.json();
            setViajes(result);
        };

        const intervalId = setInterval(fetchViajes, 5000);
        return () => clearInterval(intervalId); // Limpiar el intervalo cuando se desmonte el componente
    }, []);

    const aceptarViaje = async (viajeId) => {
        try {
            const response = await fetch(`http://localhost:9000/aceptarViaje/${viajeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setViajeAceptado(viajeId);
                Swal.fire('Viaje aceptado', 'Has aceptado el viaje correctamente.', 'success');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al aceptar viaje:', error);
            Swal.fire('Error', 'Ocurrió un error al aceptar el viaje.', 'error');
        }
    };

    const finalizarViaje = async (viajeId) => {
        try {
            const response = await fetch(`http://localhost:9000/finalizarViaje/${viajeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pagoRecibido })
            });

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire('Viaje finalizado', 'El viaje ha sido finalizado correctamente.', 'success');
                setViajeAceptado(null);
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al finalizar el viaje:', error);
            Swal.fire('Error', 'Ocurrió un error al finalizar el viaje.', 'error');
        }
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
                            <h2>Viajes disponibles</h2>
                            {viajes.length === 0 && <p>No hay viajes disponibles en este momento.</p>}
                            {viajes.length > 0 && (
                                <ul className="list-group">
                                    {viajes.map((viaje) => (
                                        <li key={viaje.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            Viaje a {viaje.destino} - {viaje.hora}
                                            {!viajeAceptado && (
                                                <button className="btn btn-primary" onClick={() => aceptarViaje(viaje.id)}>
                                                    Aceptar
                                                </button>
                                            )}
                                            {viajeAceptado === viaje.id && (
                                                <button className="btn btn-success mt-3" onClick={() => finalizarViaje(viaje.id)}>
                                                    Finalizar Viaje
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GestionarViajes;
