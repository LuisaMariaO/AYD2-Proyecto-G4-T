import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarUsuario";
import Service from "../../Services/service";
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import service from "../../Services/service";


function VerPerfil() {
    const user_id = localStorage.getItem('user_id');
    const [username, setUsername] = useState('');
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [celular, setCelular] = useState('');
    const [correo, setCorreo] = useState('');

    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    useEffect(() => {
        Service.obtenerInformacionUsuario(user_id)
            .then(({ data }) => {
                setUsername(data[0].username);
                setNombre(data[0].nombre);
                const onlyDate = data[0].fecha_nacimiento.split('T')[0];
                setFechaNacimiento(onlyDate);
                setGenero(data[0].genero);
                setCelular(data[0].celular);
                setCorreo(data[0].correo);
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const handleActualizarDatos = (e) => {
        e.preventDefault()
        let password = null

        if (contrasena != "") {
            if (contrasena != confirmarContrasena) {
                Swal.fire({
                    title: "Error",
                    text: "Las contraseñas no coinciden",
                    icon: "error"
                });
            }
            else {
                password = CryptoJS.MD5(contrasena).toString()
                service.actualizarUsuario(user_id, nombre, fechaNacimiento, genero, celular, correo, password)
                    .then(({ message }) => {

                        Swal.fire({
                            title: "¡Usuario actualizado!",
                            text: "Datos actualizados correctamente",
                            icon: "success"
                        })
                        setContrasena("")
                        setConfirmarContrasena("")

                    })
                    .catch((error) => {
                        Swal.fire({
                            title: "Error",
                            text: "Ocurrió un error en el registro, por favor intente más tarde",
                            icon: "error"
                        });
                    })
            }
        }
        else{
        service.actualizarUsuario(user_id, nombre, fechaNacimiento, genero, celular, correo, password)
            .then(({ message }) => {

                Swal.fire({
                    title: "¡Usuario actualizado!",
                    text: "Datos actualizados correctamente",
                    icon: "success"
                })


            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error en el registro, por favor intente más tarde",
                    icon: "error"
                });
            })
    }

    }

    return (
        <>
            <Navbar rol="Usuario" />
            <div class="container-fluid">
                <div class="row flex-nowrap">
                    <Sidebar></Sidebar>
                    <div class="col py-3 px-3 pt-3">
                        <div class="container mt-5">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <img src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" style={{ width: "150px", height: "150px" }} class="rounded-circle img-fluid" alt="Foto de perfil" />
                                    <h3 class="mt-3">{username}</h3>
                                </div>
                                <div class="col-md-8">
                                    <form>
                                        <div class="mb-3">
                                            <label for="nombre" class="form-label">Nombre</label>
                                            <input type="text" class="form-control" id="nombre" placeholder="Ingresa tu nombre" defaultValue={nombre} onChange={(e) => setNombre(e.target.value)} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                                            <input type="date" class="form-control" id="fechaNacimiento" defaultValue={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="genero" class="form-label">Género</label>
                                            <select class="form-select" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="celular" class="form-label" >Celular</label>
                                            <input type="tel" class="form-control" id="celular" placeholder="Ingresa tu número de celular" defaultValue={celular} onChange={(e) => setCelular(e.target.value)} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="correo" class="form-label">Correo Electrónico</label>
                                            <input type="email" class="form-control" id="correo" placeholder="Ingresa tu correo electrónico" defaultValue={correo} onChange={(e) => setCorreo(e.target.value)} />
                                        </div>

                                        <div className="form-group m-1">
                                            <label htmlFor="contrasena" className="form-label">Nueva contraseña</label>
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
                                                    {mostrarContrasena ? <i class="bi bi-eye-slash-fill"></i> : <i class="bi bi-eye-fill"></i>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="form-group m-1">
                                            <label htmlFor="confirmarContrasena" className="form-label">Confirmar contraseña</label>
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
                                        <br></br>
                                        <button type="submit" class="btn btn-primary" onClick={handleActualizarDatos}>Guardar Cambios</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerPerfil;