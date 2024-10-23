import React, { useState } from "react";
import Swal from 'sweetalert2';
import Service from "../../Services/service";
import CryptoJS from "crypto-js";
import fondo from '../../Imgs/fondo.jpeg';
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = (event) => {
        event.preventDefault();
        Service.login(user, CryptoJS.MD5(password).toString())
            .then(({ success, res }) => {
                if (success && res.length > 0) {
                    localStorage.setItem("usuario", res[0]['usuario_id']);
                    navigate("/auth");
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Usuario o contraseña incorrectos',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                }
            });
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
                    <h2 className="text-light text-center">Inicio Sesión Administrador</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group m-1">
                            <label htmlFor="user">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="user"
                                placeholder="Usuario"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                        </div>
                        <div className="form-group m-1">
                            <label htmlFor="password">Contraseña</label>
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;
