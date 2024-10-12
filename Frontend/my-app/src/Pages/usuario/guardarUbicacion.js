import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarUsuario";
import Service from "../../Services/service";
import Swal from 'sweetalert2';

function GuardarUbicacion() {
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    const [zonas, setZonas] = useState([])
    const [formData, setFormData] = useState({
        nombre: null,
        zona: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        for (let key in formData) {
            if (formData[key] == '') {
                formData[key] = null
            }
        }

        Service.guardarUbicacion(user_id, formData.nombre, formData.zona)
            .then(({ message }) => {

                Swal.fire({
                    title: "¡Ubicación guardada!",
                    text: "Ahora puedes seleccionar esa ubicación como destino.",
                    icon: "success"
                }).then(() => {
                    limpiarFormulario()
                });

            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al guardar la ubicación, por favor intente más tarde",
                    icon: "error"
                });
            })
    };

    const limpiarFormulario = () => {
        setFormData({
            nombre: '',
            zona: '',
        });
    }

    useEffect(() => {
        Service.obtenerZonas()
            .then(({ data }) => {
                setZonas(data)

            })
            .catch((error) => {
                throw error
            })
    },[]);

    return (
        <>
            <Navbar rol="Usuario" />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <div className="col">
                        <div className="py-3 px-3 pt-3 text-center">
                            <h1>Guardar ubicación</h1>
                        </div>
                        <div className="container mt-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre de la ubicación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="zona" className="form-label">Zona</label>
                                    <select
                                        className="form-select"
                                        id="zona"
                                        name="zona"
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione la zona</option>
                                        {zonas.map((partida) => (
                                            <option key={partida.zona} value={partida.zona}>
                                                Zona {partida.zona}
                                            </option>
                                        ))}

                                    </select>
                                </div>


                                <button type="submit" className="btn btn-success">Guardar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default GuardarUbicacion;