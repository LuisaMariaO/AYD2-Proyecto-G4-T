import React, { useState } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';
import { useNavigate } from 'react-router-dom';
import Service from "../../Services/service";
import CryptoJS from "crypto-js";

function LoginUsuario() {
    const navigate = useNavigate()
    const [user, setUser] = useState('');         // usuario o correo electrónico
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        Service.loginUsuario(user, CryptoJS.MD5(password).toString())
            .then(({ status, message, username, name, id }) => {
                if (status === 1) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('name', name);
                    localStorage.setItem('user_id', id)
                    navigate('/usuario');
                } else {
                    Swal.fire({
                        title: "Error",
                        text: message,
                        icon: "error"
                    });
                }

            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                });
            })
    }


    const handlePasswordOlvidada = async (e) => {
        if (user != '') {
            Service.recuperarContrasenaUsuario(user)
                .then(({ status, message }) => {
                    if (status === 1) {
                        Swal.fire({
                            title: "Correo enviado",
                            text: "Te hemos enviado un enlace al correo electrónico registrado para que puedas restablecer tu contraseña",
                            icon: "info"
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: message,
                            icon: "error"
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error"
                    });
                });
        } else {
            Swal.fire({
                title: "Error",
                text: "Por favor ingrese un correo electrónico o nombre de usuario",
                icon: "error"
            });
        }
        
    }
                


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
                            <h2 className="text-light text-center">Iniciar sesión</h2>

                            {/* Formulario para el login con correo/DPI */}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group m-1">
                                    <label htmlFor="user" className="form-label text-light">Correo o nombre de usuario</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="user"
                                        placeholder="Correo/username"
                                        value={user}
                                        onChange={(e) => setUser(e.target.value)}
                                    />
                                </div>
                                <div className="form-group m-1">
                                    <label htmlFor="password" className="form-label text-light">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-danger btn-block mx-1 mt-3">
                                        Iniciar Sesión
                                    </button>
                                    <div className="d-flex justify-content-center">
                                        <a className="text-decoration-none text-light" onClick={handlePasswordOlvidada} type="button">Olvidé mi contraseña</a>
                                    </div>

                                </div>
                            </form>

                        </div>
                    </div>


                </div>
            );
        }

        export default LoginUsuario;
