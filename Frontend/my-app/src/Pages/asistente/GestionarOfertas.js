import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";

const GestionarOfertas = () => {
    const [ofertas, setOfertas] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [descuento, setDescuento] = useState(0);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [mensajeExito, setMensajeExito] = useState(""); // Para el mensaje de éxito

    // Cargar ofertas existentes desde el backend
    useEffect(() => {
        fetch('http://localhost:9000/asistente/obtener-ofertas')
            .then(response => response.json())
            .then(data => setOfertas(data.data))
            .catch(error => console.error("Error al obtener las ofertas", error));
    }, []);

    // Función para crear una nueva oferta
    const handleCrearOferta = (e) => {
        e.preventDefault();
        const nuevaOferta = {
            descripcion,
            descuento,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado: "ACTIVA"
        };

        fetch('http://localhost:9000/asistente/crear-oferta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaOferta)
        })
            .then(response => response.json())
            .then(data => {
                // Agregar la nueva oferta a la lista
                setOfertas([...ofertas, data]);
                setMensajeExito("Oferta creada exitosamente!"); // Mostrar mensaje de éxito
                // Limpiar los inputs
                setDescripcion("");
                setDescuento(0);
                setFechaInicio("");
                setFechaFin("");

                // Ocultar el mensaje después de unos segundos
                setTimeout(() => {
                    setMensajeExito("");
                }, 3000);
            })
            .catch(error => {
                console.error("Error al crear la oferta", error);
            });
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="my-4">Gestionar Ofertas Promocionales</h1>

                {/* Mensaje de éxito */}
                {mensajeExito && (
                    <div className="alert alert-success" role="alert">
                        {mensajeExito}
                    </div>
                )}

                {/* Formulario para crear una nueva oferta */}
                <form onSubmit={handleCrearOferta}>
                    <div className="mb-3">
                        <label>Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Descuento (%)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={descuento}
                            onChange={(e) => setDescuento(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Crear Oferta</button>
                </form>

                {/* Listado de ofertas ya creadas */}
                <h2 className="mt-5">Ofertas Actuales</h2>
                {ofertas.length > 0 ? (
                    <ul className="list-group">
                        {ofertas.map((oferta) => (
                            <li key={oferta.id} className="list-group-item">
                                <strong>{oferta.descripcion}</strong> - Descuento: {oferta.descuento}% - Vigencia: {oferta.fecha_inicio} a {oferta.fecha_fin} - Estado: {oferta.estado}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay ofertas creadas aún.</p>
                )}
            </div>
        </>
    );
};

export default GestionarOfertas;
