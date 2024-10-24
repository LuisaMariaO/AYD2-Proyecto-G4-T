import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarAdmin";
import Swal from 'sweetalert2';
import Service from "../../Services/service";

function RegistrarAsistente() {
    const [estadosCiviles, setestadosCiviles] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        genero: "",
        celular: "",
        edad: "",
        fotografia: null,
        direccion: "",
        estado_civil: "",
        correo: "",
        dpi: "",
        fecha_nacimiento: "",
        username: "",
        cv: null
    });

    useEffect(() => {
        Service.obtenerEstadosCiviles()
            .then(({ estado_civil }) => {
                setestadosCiviles(estado_civil)
            })
            .catch((error) => {
                throw error
            })
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.estado_civil === "") {
            Swal.fire('Error', 'Debe seleccionar un estado civil', 'error');
            return;
        }
        
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        const cvBase64 = formData.cv ? await convertToBase64(formData.cv) : null;
        const fotografiaBase64 = formData.fotografia ? await convertToBase64(formData.fotografia) : null;

        formData.cv = cvBase64.split(',')[1];
        formData.fotografia = fotografiaBase64.split(',')[1];

        const response = await fetch('http://localhost:9000/admin/create-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            Swal.fire('Registro exitoso', '', 'success');
            setFormData({
                nombre: "",
                genero: "",
                celular: "",
                edad: "",
                fotografia: null,
                direccion: "",
                estado_civil: "",
                correo: "",
                dpi: "",
                fecha_nacimiento: "",
                username: "",
                cv: null
            });
        } else {
            Swal.fire('Error en el registro', 'Por favor, intenta de nuevo', 'error');
        }

    };

    return (
        <>
            <Navbar rol="Administrador" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar />
                    <div className="align-items-center m-3">
                        <h2>Contratar Asistente</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label htmlFor="nombre" className="form-label mb-0">Nombre</label>
                                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="genero" className="form-label mb-0">Género</label>
                                    <select className="form-select" id="genero" name="genero" value={formData.genero} onChange={handleChange} required>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label htmlFor="celular" className="form-label mb-0">Celular</label>
                                    <input type="tel" className="form-control" id="celular" name="celular" value={formData.celular} onChange={handleChange} required />
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="correo" className="form-label  mb-0">Correo</label>
                                    <input type="email" className="form-control" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
                                </div>


                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label htmlFor="edad" className="form-label  mb-0">Edad</label>
                                    <input type="number" className="form-control" id="edad" name="edad" value={formData.edad} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="fecha_nacimiento" className="form-label  mb-0">Fecha de Nacimiento</label>
                                    <input type="date" className="form-control" id="fecha_nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label htmlFor="direccion" className="form-label mb-0">Dirección</label>
                                    <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="estado_civil" className="form-label mb-0">Estado Civil</label>
                                    <select className="form-select" id="estado_civil" name="estado_civil" value={formData.estado_civil} onChange={handleChange} required>
                                        <option value="">Seleccionar</option>
                                        {estadosCiviles.map((estado) => (
                                            <option key={estado.estado_civil_id} value={estado.estado_civil_id}>
                                                {estado.nombre_estado_civil}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label htmlFor="dpi" className="form-label mb-0">DPI</label>
                                    <input type="text" className="form-control" id="dpi" name="dpi" value={formData.dpi} onChange={handleChange} required />
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="username" className="form-label mb-0">Username</label>
                                    <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label htmlFor="cv" className="form-label mb-0">Currículum Vitae (CV)</label>
                                    <input type="file" className="form-control" id="cv" name="cv" accept=".pdf" onChange={handleChange} required />
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="fotografia" className="form-label mb-0">Fotografía</label>
                                    <input type="file" className="form-control" id="fotografia" name="fotografia" accept="image/*" onChange={handleChange} required />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-secondary mt-4">Registrar asistente</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegistrarAsistente;