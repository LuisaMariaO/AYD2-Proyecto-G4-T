import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";

function ReportarProblema({ viajeId }) {
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [evidencia, setEvidencia] = useState(null);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        // Obtener las categorías de problemas desde el backend
        const fetchCategorias = async () => {
            const response = await fetch('http://localhost:9000/categoriasProblema');
            const result = await response.json();
            setCategorias(result);
        };

        fetchCategorias();
    }, []);

    const handleEvidenciaChange = (e) => {
        setEvidencia(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('categoria', categoria);
        formData.append('evidencia', evidencia);
        formData.append('viajeId', viajeId); // ID del viaje

        try {
            const response = await fetch('http://localhost:9000/reportarProblema', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire('Reporte enviado', 'El problema ha sido reportado exitosamente.', 'success');
                setDescripcion('');
                setCategoria('');
                setEvidencia(null);
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
