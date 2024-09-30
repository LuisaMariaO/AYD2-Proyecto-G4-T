import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";

function ReportarProblema() {
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [evidencia, setEvidencia] = useState(''); // Base64 string for PDF
    const [categorias, setCategorias] = useState([]);
    const [viajes, setViajes] = useState([]);
    const [viajeId, setViajeId] = useState('');

    // Obtener el conductorId desde localStorage
    const conductorId = localStorage.getItem('conductorId');

    // Obtener las categorías de problemas desde el backend
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:9000/conductor/categoriasProblema');
                const result = await response.json();
                setCategorias(result);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
                Swal.fire('Error', 'No se pudieron cargar las categorías de problemas.', 'error');
            }
        };

        fetchCategorias();
    }, []);

    // Obtener los viajes realizados por el conductor desde localStorage
    useEffect(() => {
        const fetchViajes = async () => {
            try {
                if (conductorId) {
                    const response = await fetch(`http://localhost:9000/conductor/viajesConductor/${conductorId}`);
                    const result = await response.json();
                    if (result.status === 'success') {
                        setViajes(result.viajes);
                    } else {
                        console.error('Error al obtener viajes:', result.message);
                        Swal.fire('Error', 'No se pudieron cargar los viajes.', 'error');
                    }
                } else {
                    Swal.fire('Error', 'No se encontró el ID del conductor en localStorage.', 'error');
                }
            } catch (error) {
                console.error('Error al obtener los viajes:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener los viajes.', 'error');
            }
        };

        fetchViajes();
    }, [conductorId]);

        // Convertir archivo PDF a Base64
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };
    

    // Convert PDF to Base64
    const handleEvidenciaChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const evidenciaBase64 = await convertToBase64(file);
                const evidenciaNoheader = evidenciaBase64.split(',')[1]; // Eliminar el encabezado "data:application/pdf;base64,"
                setEvidencia(evidenciaNoheader); // Guardar el string Base64 sin encabezado
            } catch (error) {
                console.error('Error al convertir archivo:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            descripcion,
            categoria,
            evidencia, // Send the Base64 encoded PDF
            viajeId
        };

        try {
            const response = await fetch('http://localhost:9000/conductor/reportarProblema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire('Reporte enviado', 'El problema ha sido reportado exitosamente.', 'success');
                setDescripcion('');
                setCategoria('');
                setEvidencia('');
                setViajeId('');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            Swal.fire('Error', 'Ocurrió un error al enviar el reporte.', 'error');
        }
    };

    return (
        <>
            <Navbar rol="Conductor" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar />
                    <div className="col py-3 px-3 pt-3">
                        <h1>Reportar un Problema</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="viaje">Selecciona el Viaje</label>
                                <select
                                    className="form-control"
                                    id="viaje"
                                    value={viajeId}
                                    onChange={(e) => setViajeId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona un viaje</option>
                                    {viajes.map((viaje) => (
                                        <option key={viaje.viaje_id} value={viaje.viaje_id}>
                                            {`Viaje ID: ${viaje.viaje_id} - Fecha: ${viaje.fecha} - Precio: Q${viaje.precio}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoria">Categoría del Problema</label>
                                <select
                                    className="form-control"
                                    id="categoria"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.categoria_id} value={cat.categoria_id}>
                                            {cat.categoria_nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción del Problema</label>
                                <textarea
                                    className="form-control"
                                    id="descripcion"
                                    rows="3"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="evidencia">Adjuntar Evidencia</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="evidencia"
                                    accept="application/pdf, image/*"
                                    onChange={handleEvidenciaChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-danger mt-3">
                                Enviar Reporte
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportarProblema;
