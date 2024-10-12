import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";

function Ganancias() {
    const [gananciasDiarias, setGananciasDiarias] = useState(0);
    const [gananciasSemanales, setGananciasSemanales] = useState(0);
    const [gananciasMensuales, setGananciasMensuales] = useState(0);
    const [viajes, setViajes] = useState([]);

    useEffect(() => {
        const conductorId = localStorage.getItem('conductorId');

        if (conductorId) {
            // Obtener las ganancias del backend
            const fetchGanancias = async () => {
                try {
                    const response = await fetch('http://localhost:9000/conductor/ganancias', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ conductorId })
                    });
                    const result = await response.json();
                    if (result.status === 'success') {
                        setGananciasDiarias(result.gananciasDiarias);
                        setGananciasSemanales(result.gananciasSemanales);
                        setGananciasMensuales(result.gananciasMensuales);
                        setViajes(result.viajes);
                    } else {
                        Swal.fire('Error', result.message, 'error');
                    }
                } catch (error) {
                    console.error('Error al obtener ganancias:', error);
                    Swal.fire('Error', 'Ocurrió un error al obtener las ganancias.', 'error');
                }
            };
            fetchGanancias();
        } else {
            Swal.fire('Error', 'No se pudo encontrar el ID del conductor.', 'error');
        }
    }, []);

    const calcularComision = (precio) => {
        return (precio * 0.1).toFixed(2);
    };

    const calcularGananciaNeta = (precio) => {
        return (precio * 0.9).toFixed(2);
    };

    return (
        <>
            <Navbar rol="Conductor" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar />
                    <div className="col py-3 px-3 pt-3">
                        <h1>Resumen de Ganancias</h1>
                        <div className="ganancias-totales mt-4">
                            <h2>Desglose de Ganancias</h2>
                            <ul>
                                <li><strong>Ganancias Diarias:</strong> Q{gananciasDiarias}</li>
                                <li><strong>Ganancias Semanales:</strong> Q{gananciasSemanales}</li>
                                <li><strong>Ganancias Mensuales:</strong> Q{gananciasMensuales}</li>
                            </ul>
                            
                            <h3>Detalle de viajes:</h3>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Viaje ID</th>
                                        <th>Fecha</th>
                                        <th>Tarifa del Viaje</th>
                                        <th>Comisión de la Plataforma (10%)</th>
                                        <th>Ganancia Neta</th>
                                        <th>Método de pago</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viajes.length > 0 ? (
                                        viajes.map((viaje) => (
                                            <tr key={viaje.viaje_id}>
                                                <td>{viaje.viaje_id}</td>
                                                <td>{new Date(viaje.fecha).toLocaleDateString()}</td>
                                                <td>Q{viaje.precio}</td>
                                                <td>Q{calcularComision(viaje.precio)}</td>
                                                <td>Q{calcularGananciaNeta(viaje.precio)}</td>
                                                <td>{viaje.metodo_pago === 'T' ? 'Tarjeta' : 'Efectivo'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">No se han registrado viajes.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ganancias;
