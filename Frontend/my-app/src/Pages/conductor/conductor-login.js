import React, { useState } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';
import { Link } from 'react-router-dom';

function LoginConductor() {
    const [user, setUser] = useState('');         // Para correo o DPI
    const [password, setPassword] = useState(''); // Para contraseña
    const [codigoTrabajador, setCodigoTrabajador] = useState(''); // Nuevo input para el código de trabajador
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const loginData = {
            identifier: user,  // Para correo o DPI
            password
        };
    
        try {
            const response = await fetch('http://localhost:9000/conductor/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
    
            const result = await response.json();
    
            if (result.status === 'no_verificado') {
                Swal.fire('Usuario no verificado', 'Por favor, actualiza tu contraseña.', 'warning');
                setUserId(result.usuario_id);
                setShowModal(true);  // Mostrar modal para cambiar contraseña
            } else if (result.status === 'success') {
                // Guardar el usuario_id (conductor_id) en localStorage
                localStorage.setItem('conductorId', result.usuario_id);
                window.location.href = '/conductor';  // Redirigir si está verificado
            } else {
                Swal.fire('Error en el inicio de sesión', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error durante el inicio de sesión', 'error');
        }
    };
    
    const handleCodigoSubmit = async (e) => {
        e.preventDefault();
    
        // Enviar solo el código de trabajador (usuario_id)
        const codigoData = {
            codigoTrabajador
        };
    
        try {
            const response = await fetch('http://localhost:9000/conductor/loginCodigo', { // Nuevo endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(codigoData)
            });
    
            const result = await response.json();
    
            if (result.status === 'no_verificado') {
                Swal.fire('Usuario no verificado', 'Por favor, actualiza tu contraseña.', 'warning');
                setUserId(result.usuario_id);
                setShowModal(true);  // Mostrar modal para cambiar contraseña
            } else if (result.status === 'success') {
                // Guardar el usuario_id (conductor_id) en localStorage
                localStorage.setItem('conductorId', result.usuario_id);
                window.location.href = '/conductor';  // Redirigir si está verificado
            } else {
                Swal.fire('Error en el inicio de sesión', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error durante el inicio de sesión', 'error');
        }
    };
    

    const handlePasswordChange = async () => {
        const updatePasswordData = { userId, newPassword };

        try {
            const response = await fetch('http://localhost:9000/conductor/actualizarContrasena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePasswordData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire('Contraseña actualizada', 'Ahora puedes iniciar sesión con tu nueva contraseña.', 'success');
                setShowModal(false);  // Cerrar modal
                window.location.href = '/conductor';  // Redirigir a la vista de conductor
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al actualizar la contraseña', 'error');
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
                            <label htmlFor="user">Correo o DPI</label>
                            <input
                                type="text"
                                className="form-control"
                                id="user"
                                placeholder="Correo electronico"
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
                            <button id="login-button" type="submit" className="btn btn-danger btn-block mx-1 mt-3">
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>

                    {/* Nuevo formulario para iniciar sesión solo con el código de trabajador */}
                    <form onSubmit={handleCodigoSubmit} className="mt-4">
                        <div className="form-group m-1">
                            <label htmlFor="codigoTrabajador">Código de Trabajador</label>
                            <input
                                type="text"
                                className="form-control"
                                id="codigoTrabajador"
                                placeholder="Código de Trabajador"
                                value={codigoTrabajador}
                                onChange={(e) => setCodigoTrabajador(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button id="codigo-trabajador-button" type="submit" className="btn btn-primary btn-block mx-1 mt-3">
                                Iniciar con Código de Trabajador
                            </button>
                            <Link to="/" className="btn btn-secondary btn-block mx-1 mt-3" id="regresar-button">
                                Regresar a la página principal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Actualizar Contraseña</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="newPassword">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPassword"
                                        placeholder="Nueva Contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={handlePasswordChange}>Actualizar Contraseña</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginConductor;
