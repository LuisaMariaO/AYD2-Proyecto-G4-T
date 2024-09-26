import React, { useState } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';
import Service from "../../Services/service";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';

function RegistroUsuario() {
    const navigate = useNavigate();
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [correo, setCorreo] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(contrasena==confirmarContrasena){
        Service.registroUsuario(nombreCompleto, fechaNacimiento, genero, correo, numeroCelular,  CryptoJS.MD5(contrasena).toString())
            .then(({ message}) => {

                Swal.fire({
                    title: "¡Usuario registrado!",
                    text: "Verifica tu correo electrónico para continuar",
                    icon: "success"
                  }).then(() => {
                    navigate('/');
                  });
                

            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error en el registro, por favor intente más tarde",
                    icon: "error"
                  });
            })
        }
        else{
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error"
              });
        }

    };
    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
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
                            <label htmlFor="nombre" className="form-label text-light" >Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                placeholder="Nombre Completo"
                                name="nombre"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="fechaNacimiento" className="form-label text-light">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fechaNacimiento"
                                name="fecha_nacimiento"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="genero" className="form-label text-light">Género</label>
                            <select
                                className="form-control"
                                id="genero"
                                value={genero}
                                name="genero"
                                onChange={(e) => setGenero(e.target.value)}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="correo" className="form-label text-light">Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                id="correo"
                                placeholder="Correo"
                                value={correo}
                                name="correo"
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="numeroCelular" className="form-label text-light">Número de Celular</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="numeroCelular"
                                placeholder="Número de Celular"
                                value={numeroCelular}
                                name="celular"
                                onChange={(e) => setNumeroCelular(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="contrasena" className="form-label text-light">Contraseña</label>
                            <div className="input-group">
                                <input
                                    type={mostrarContrasena ? "text" : "password"}
                                    className="form-control"
                                    id="contrasena"
                                    placeholder="Contraseña"
                                    name="password"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={toggleMostrarContrasena}
                                >
                                    {mostrarContrasena ? <i class="bi bi-eye-slash-fill"></i> :  <i class="bi bi-eye-fill"></i>}
                                </button>
                            </div>
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="confirmarContrasena" className="form-label text-light">Confirmar contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmarContrasena"
                                placeholder="Confirmar Contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                required
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

export default RegistroUsuario;
