import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";

function Conductor() {
    const [cancelaciones, setCancelaciones] = useState(0);
    const [mostrarJustificacion, setMostrarJustificacion] = useState(false);
    const [pdfJustificacion, setPdfJustificacion] = useState(null);

    // Obtener el ID del conductor del localStorage
    const conductorId = localStorage.getItem('conductorId');

    useEffect(() => {
        // Obtener el número de cancelaciones del localStorage
        const cancelacionesGuardadas = localStorage.getItem(`cancelaciones_${conductorId}`);
        const cancelacionesCount = cancelacionesGuardadas ? parseInt(cancelacionesGuardadas, 10) : 0;
        setCancelaciones(cancelacionesCount);

        // Si el número de cancelaciones es 10 o más, mostrar el formulario para justificar
        if (cancelacionesCount >= 10) {
            setMostrarJustificacion(true);
        }
    }, [conductorId]);

    // Manejar la carga del archivo PDF
    const handleFileChange = (e) => {
        setPdfJustificacion(e.target.files[0]);
    };

    // Manejar el envío de la justificación
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!pdfJustificacion) {
            return Swal.fire('Error', 'Por favor, sube un archivo PDF como justificación.', 'error');
        }

        // Simulación de envío del PDF
        console.log('Enviando justificación:', pdfJustificacion);

        // Restablecer el contador de cancelaciones a 0
        localStorage.setItem(`cancelaciones_${conductorId}`, 0);
        setCancelaciones(0);
        setMostrarJustificacion(false);

        // Mensaje de éxito
        Swal.fire('Éxito', 'Justificación enviada correctamente. El contador de cancelaciones se ha restablecido.', 'success')
            .then(() => {
                window.location.reload(); // Actualizar la página después del éxito
            });
    };

    return (
        <>
            <Navbar rol="Conductor" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar></Sidebar>
                    <div className="col py-3 px-3 pt-3">
                        <h1>¡Bienvenido Conductor!</h1>
                        <p><strong>Cancelaciones realizadas hoy:</strong> {cancelaciones}</p>

                        {mostrarJustificacion ? (
                            <div className="mt-4">
                                <h3>Has alcanzado el límite de 10 cancelaciones.</h3>
                                <p>Por favor, sube un PDF con la justificación para restablecer el contador.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="justificacion">Subir PDF de Justificación:</label>
                                        <input
                                            type="file"
                                            id="justificacion"
                                            className="form-control"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-3">
                                        Enviar Justificación
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <p>No has alcanzado el límite de cancelaciones.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Conductor;
