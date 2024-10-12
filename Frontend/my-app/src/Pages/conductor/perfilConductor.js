import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarConductor";

function PerfilConductor() {
    const [conductor, setConductor] = useState({
        nombre: '',
        direccion: '',
        celular: '',
        correo: '',
    });
    const [vehiculo, setVehiculo] = useState({
        placa: '',
        marca: '',
        anio: '',
    });
    const [marcas, setMarcas] = useState([]); // Estado para almacenar las marcas de vehículos
    const [pdfActualizacion, setPdfActualizacion] = useState(null); // Estado para el archivo PDF de actualización

    // Obtener las marcas de vehículos desde el backend
    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await fetch('http://localhost:9000/conductor/marcas');
                const result = await response.json();
                if (result.status === 'success') {
                    setMarcas(result.marcas);
                } else {
                    Swal.fire('Error', result.message, 'error');
                }
            } catch (error) {
                console.error('Error al obtener las marcas de vehículos:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener las marcas de vehículos.', 'error');
            }
        };
        fetchMarcas();
    }, []);

    useEffect(() => {
        const conductorId = localStorage.getItem('conductorId');
        const fetchConductorInfo = async () => {
            try {
                const response = await fetch('http://localhost:9000/conductor/perfil', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ conductorId })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    setConductor(result.conductor);
                    setVehiculo({
                        placa: result.conductor.placa,
                        marca: result.conductor.marca,  // Usar marca_id
                        anio: result.conductor.anio,
                    });
                } else {
                    Swal.fire('Error', result.message, 'error');
                }

                console.log(vehiculo.anio);
                console.log(vehiculo.marca);
                console.log(vehiculo.placa);
            } catch (error) {
                console.error('Error al obtener la información del conductor:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener la información del conductor.', 'error');
            }
        };
        fetchConductorInfo();
    }, []);

    // Manejo de cambios en el formulario de datos del usuario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConductor(prev => ({ ...prev, [name]: value }));
    };

    // Manejo de cambios en el formulario de datos del vehículo
    const handleVehiculoChange = (e) => {
        const { name, value } = e.target;
        setVehiculo(prev => ({ ...prev, [name]: value }));
    };

    // Función para manejar el archivo PDF de verificación
    const handleFileChange = (e) => {
        setPdfActualizacion(e.target.files[0]);
    };

    // Función para convertir el archivo PDF a Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Función para actualizar la información del conductor y vehículo junto con el PDF
    const handleActualizar = async (e) => {
        e.preventDefault();

        const conductorId = localStorage.getItem('conductorId');

        // Convertir PDF a base64
        const pdfBase64 = pdfActualizacion ? await convertToBase64(pdfActualizacion) : null;
        const pdfNoHeader = pdfBase64 ? pdfBase64.split(',')[1] : null;

        const data = {
            nombre: conductor.nombre,
            direccion: conductor.direccion,
            celular: conductor.celular,
            correo: conductor.correo,
            placa: vehiculo.placa,
            marca: vehiculo.marca,  // Aquí se envía el ID de la marca
            anio: vehiculo.anio,
            pdfActualizacion: pdfNoHeader // Enviar el PDF base64
        };

        console.log(vehiculo.anio);
        console.log(vehiculo.marca);
        console.log(vehiculo.placa);

        try {
            const response = await fetch('http://localhost:9000/conductor/perfil/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ conductorId, data })
            });
            const result = await response.json();
            if (result.status === 'success') {
                Swal.fire('Éxito', 'La información del usuario y vehículo ha sido actualizada correctamente.', 'success');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error al actualizar la información del usuario y vehículo:', error);
            Swal.fire('Error', 'Ocurrió un error al actualizar la información del usuario y vehículo.', 'error');
        }
    };

    return (
        <>
            <Navbar rol="Conductor" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar />
                    <div className="col py-3 px-3 pt-3">
                        <h1>Perfil del Conductor</h1>

                        {/* Formulario para actualizar la información del usuario y vehículo */}
                        <form onSubmit={handleActualizar} encType="multipart/form-data">
                            <h3>Información Personal</h3>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={conductor.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="direccion"
                                    value={conductor.direccion}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Número de Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="celular"
                                    value={conductor.celular}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="correo"
                                    value={conductor.correo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <h3 className="mt-5">Información del Vehículo</h3>
                            <div className="form-group">
                                <label>Placa</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="placa"
                                    value={vehiculo.placa}
                                    onChange={handleVehiculoChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Marca</label>
                                <select
                                    className="form-control"
                                    name="marca"
                                    value={vehiculo.marca}
                                    onChange={handleVehiculoChange}
                                    required
                                >
                                    <option value="">Selecciona una marca</option>
                                    {marcas.map((marca) => (
                                        <option key={marca.marca_id} value={marca.marca_id}>
                                            {marca.marca_nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Año</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="anio"
                                    value={vehiculo.anio}
                                    onChange={handleVehiculoChange}
                                    required
                                />
                            </div>

                            <div className="form-group mt-4">
                                <label>Subir PDF de Actualización</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-success mt-3">Actualizar Información</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PerfilConductor;
