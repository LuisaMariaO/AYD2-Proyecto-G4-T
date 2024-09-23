import React, { useState } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';

function RegistroConductor() {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [correo, setCorreo] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire('Registrando...');
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
                            <label htmlFor="nombre">Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                placeholder="Nombre Completo"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fechaNacimiento"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="genero">Género</label>
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
                            <label htmlFor="correo">Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                id="correo"
                                placeholder="Correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="numeroCelular">Número de Celular</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="numeroCelular"
                                placeholder="Número de Celular"
                                value={numeroCelular}
                                onChange={(e) => setNumeroCelular(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="contrasena">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="contrasena"
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmarContrasena"
                                placeholder="Confirmar Contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-danger btn-block mx-1 mt-3">
                                Registrarme
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegistroConductor;
