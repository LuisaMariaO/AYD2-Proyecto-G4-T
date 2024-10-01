import React, { useState } from "react";
import fondo from '../../Imgs/fondo.jpeg';
import { useNavigate } from 'react-router-dom';

const InicioSesionAsistente = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState('');         // usuario o correo electrónico
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Cuerpo de la solicitud
        const body = {
            user: user,
            password: password
        };

        try {
            // Realizamos la solicitud con fetch
            const response = await fetch('http://localhost:9000/asistente/sesion-asistente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            // Validamos la respuesta
            const data = await response.json();
            if (data.status === 1) {
                // Redirigir a la página principal
                navigate('/asistente');  
            } else {
                // Si hay un error, mostramos el mensaje que venga del backend
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la conexión con el servidor');
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
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default InicioSesionAsistente;