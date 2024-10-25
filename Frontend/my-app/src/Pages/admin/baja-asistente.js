import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarAdmin";
import Service from "../../Services/service";
import Swal from 'sweetalert2';
import foto from '../../Imgs/foto-por-defecto.jpg';

function BajaAsistente() {
    const [motivo, setMotivo] = useState("");
    const [motivos, setMotivos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [asistente, setAsistente] = useState({
        fotografia: '',
        nombre: '',
        correo: '',
        dpi: '',
        usuario_id: '',
        username: ''
    });

    useEffect(() => {
        Service.obtenerMotivosBajas()
            .then(({ motivos }) => {
                setMotivos(motivos)
            })
            .catch((error) => {
                throw error
            })
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        Service.buscarAsistente(busqueda)
            .then(({ success, data }) => {
                if (success && data.length > 0) {
                    setAsistente(data[0]);
                } else {
                    Swal.fire({
                        text: 'No fue posible encontrar el asistente',
                        icon: 'info',
                        confirmButtonText: 'Ok'
                    })
                    setAsistente({
                        fotografia: '',
                        nombre: '',
                        correo: '',
                        dpi: '',
                        usuario_id: '',
                        username: ''
                    });
                }
            });
    }

    const handleClean = () => {
        setBusqueda('');
        setAsistente({
            fotografia: '',
            nombre: '',
            correo: '',
            dpi: '',
            usuario_id: '',
            username: ''
        });
    }

    const handleBaja = () => {
        if (motivo !== ""){
            Service.bajaAsistente(asistente.usuario_id, motivo)
            .then(({ success, res }) => {
                if (success){
                    Swal.fire({
                        text: 'El/La asistente ha sido dado de baja.',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    })
                    handleClean()
                }
            })
            .catch((error) => {
                throw error
            })
        }
    }

    return (
        <>
            <Navbar rol="Administrador" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar></Sidebar>
                    <div className="col-9 align-items-center m-3">
                        <h2>Baja Asistentes</h2>
                        <div className="row mt-5">
                            <div className="col-md-4">
                                <label className="form-label mb-0" htmlFor="buscarAsistente">Buscar Asistente</label>
                                <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} type="text" className="form-control" placeholder="DPI / Correo / Username" id="buscarAsistente" />
                            </div>
                            <div className="col-md-4 mt-4">
                                <button onClick={handleSearch} type="button" className="btn btn-secondary mx-1">Buscar</button>
                                <button onClick={handleClean} type="button" className="btn btn-danger">Limpiar</button>
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="card bg-danger-subtle" style={{ width: '35rem' }}>
                                <img
                                    src={asistente.fotografia || foto}
                                    className="card-img-top px-5 pt-3"
                                    alt={asistente.nombre}
                                    style={{height:'15rem'}}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{asistente.nombre}</h5>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Correo: {asistente.correo}</li>
                                    <li className="list-group-item">DPI: {asistente.dpi}</li>
                                    <li className="list-group-item">Usuario: {asistente.username}</li>
                                    <li className="list-group-item bg-danger-subtle">
                                        <div className="row m-1">
                                        <div className="col-md-8">
                                            <select disabled={asistente.nombre ? false : true} className="form-select" id="estado_civil" name="estado_civil" required
                                            value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                                                {motivos.map((motivo) => (
                                                    <option key={motivo.id} value={motivo.id}>
                                                        {motivo.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <button onClick={handleBaja} disabled={asistente.nombre ? false : true} type="button" className="btn btn-danger">Dar de Baja</button>
                                        </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BajaAsistente;