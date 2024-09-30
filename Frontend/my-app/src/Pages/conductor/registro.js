import React, { useState } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';
import { Link } from 'react-router-dom';


function RegistroConductor() {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [numeroTelefono, setNumeroTelefono] = useState('');
    const [edad, setEdad] = useState('');
    const [numeroDpi, setNumeroDpi] = useState('');
    const [correo, setCorreo] = useState('');
    const [cv, setCv] = useState(null);
    const [fotografia, setFotografia] = useState(null);
    const [fotoVehiculo, setFotoVehiculo] = useState(null);
    const [numeroPlaca, setNumeroPlaca] = useState('');
    const [marcaVehiculo, setMarcaVehiculo] = useState(''); // ID de la marca del vehículo
    const [anioVehiculo, setAnioVehiculo] = useState('');
    const [genero, setGenero] = useState('');
    const [estadoCivil, setEstadoCivil] = useState(''); // ID del estado civil
    const [direccionDomicilio, setDireccionDomicilio] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convertir archivos a Base64
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        try {
            // Convertir CV, Fotografía y Fotografía del Vehículo a Base64
            const cvBase64 = cv ? await convertToBase64(cv) : null;
            const fotografiaBase64 = fotografia ? await convertToBase64(fotografia) : null;
            const fotoVehiculoBase64 = fotoVehiculo ? await convertToBase64(fotoVehiculo) : null;

            const cvNoheader = cvBase64.split(',')[1];
            const fotografiaNoheader = fotografiaBase64.split(',')[1];
            const fotoVehiculoNoheader = fotoVehiculoBase64.split(',')[1];

            // Crear el objeto que se enviará
            const conductorData = {
                nombreCompleto,
                numeroTelefono,
                edad,
                numeroDpi,
                correo,
                cv: cvNoheader, // Archivo en base64
                fotografia: fotografiaNoheader, // Archivo en base64
                fotoVehiculo: fotoVehiculoNoheader, // Archivo en base64
                numeroPlaca,
                marcaVehiculo, // ID de la marca seleccionada
                anioVehiculo,
                genero,
                estadoCivil, // ID del estado civil seleccionado
                direccionDomicilio
            };

            console.log(cvBase64);

            // Enviar el objeto como un JSON al servidor en localhost:9000
            const response = await fetch('http://localhost:9000/conductor/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(conductorData)
            });

            if (response.ok) {
                Swal.fire('Registro exitoso', '', 'success');
            } else {
                Swal.fire('Error en el registro', 'Por favor, intenta de nuevo', 'error');
            }

        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar el registro', 'error');
            console.error('Error al procesar archivos:', error);
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ position: 'relative', padding: 0 }}>
            <div
                className="col-12"
                style={{
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1
                }}
            ></div>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '20px',
                zIndex: 2
            }}></div>
            <div className="col-12 bg-dark row justify-content-center py-5" style={{ position: 'relative', zIndex: 2, width: '600px', borderRadius: '20px' }}>
                <div className="col-md-9 col-lg-9">
                    <h2 className="text-light text-center">Registro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group m-1">
                            <label htmlFor="nombreCompleto" className="text-light">Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombreCompleto"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="numeroTelefono" className="text-light">Número de Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="numeroTelefono"
                                value={numeroTelefono}
                                onChange={(e) => setNumeroTelefono(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="edad" className="text-light">Edad</label>
                            <input
                                type="number"
                                className="form-control"
                                id="edad"
                                value={edad}
                                onChange={(e) => setEdad(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="numeroDpi" className="text-light">Número de DPI</label>
                            <input
                                type="text"
                                className="form-control"
                                id="numeroDpi"
                                value={numeroDpi}
                                onChange={(e) => setNumeroDpi(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="correo" className="text-light">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                id="correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="cv" className="text-light">Papelería Completa (CV en PDF)</label>
                            <input
                                type="file"
                                className="form-control"
                                id="cv"
                                accept="application/pdf"
                                onChange={(e) => setCv(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="fotografia" className="text-light">Fotografía</label>
                            <input
                                type="file"
                                className="form-control"
                                id="fotografia"
                                accept="image/*"
                                onChange={(e) => setFotografia(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="fotoVehiculo" className="text-light">Fotografía del Vehículo</label>
                            <input
                                type="file"
                                className="form-control"
                                id="fotoVehiculo"
                                accept="image/*"
                                onChange={(e) => setFotoVehiculo(e.target.files[0])}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="numeroPlaca" className="text-light">Número de Placa</label>
                            <input
                                type="text"
                                className="form-control"
                                id="numeroPlaca"
                                value={numeroPlaca}
                                onChange={(e) => setNumeroPlaca(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="marcaVehiculo" className="text-light">Marca del Vehículo</label>
                            <select
                                className="form-control"
                                id="marcaVehiculo"
                                value={marcaVehiculo}
                                onChange={(e) => setMarcaVehiculo(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                <option value="1">Toyota</option>
                                <option value="2">Ford</option>
                                <option value="3">Honda</option>
                                <option value="4">Chevrolet</option>
                                <option value="5">Nissan</option>
                                <option value="6">Volkswagen</option>
                                <option value="7">Hyundai</option>
                                <option value="8">Kia</option>
                                <option value="9">Subaru</option>
                                <option value="10">Mazda</option>
                                <option value="11">BMW</option>
                                <option value="12">Mercedes-Benz</option>
                                <option value="13">Audi</option>
                                <option value="14">Porsche</option>
                                <option value="15">Tesla</option>
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="anioVehiculo" className="text-light">Año del Vehículo</label>
                            <input
                                type="number"
                                className="form-control"
                                id="anioVehiculo"
                                value={anioVehiculo}
                                onChange={(e) => setAnioVehiculo(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="genero" className="text-light">Género</label>
                            <select
                                className="form-control"
                                id="genero"
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="estadoCivil" className="text-light">Estado Civil</label>
                            <select
                                className="form-control"
                                id="estadoCivil"
                                value={estadoCivil}
                                onChange={(e) => setEstadoCivil(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                <option value="1">Soltera/o</option>
                                <option value="2">Casada/o</option>
                                <option value="3">Divorciado/a</option>
                                <option value="4">Viudo/a</option>
                                <option value="5">Unido de hecho</option>
                                <option value="6">Separado/a</option>
                                <option value="7">En pareja</option>
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="direccionDomicilio" className="text-light">Dirección de Domicilio</label>
                            <input
                                type="text"
                                className="form-control"
                                id="direccionDomicilio"
                                value={direccionDomicilio}
                                onChange={(e) => setDireccionDomicilio(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-danger btn-block mx-1 mt-3">
                                Registrarme
                            </button>
                            <Link to="/" className="btn btn-secondary btn-block mx-1 mt-3">
        Regresar a la página principal
    </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegistroConductor;
