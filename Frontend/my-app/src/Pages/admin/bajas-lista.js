import { React, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarAdmin";
import Service from "../../Services/service";

function BajasListado() {
    const [bajas, setBajas] = useState([]);

    useEffect(() => {
        Service.listadoBajas()
            .then(({ success, data }) => {
                if (success) {
                    setBajas(data)
                }
            })
            .catch((error) => {
                throw error
            })
    }, []);

    return (
        <>
            <Navbar rol="Administrador" />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar></Sidebar>
                    <div className="col-9 align-items-center m-3">
                        <h2>Listado de Bajas</h2>
                        {bajas.map((baja) => (
                            <div class="card mt-3" style={{width: "18rem"}}>
                            <div class="card-body">
                              <h5 class="card-title">{baja.nombre}</h5>
                              <h6 class="card-subtitle mb-2 text-body-secondary">Motivo baja: {baja.descripcion}</h6>
                              <p class="card-text">Fecha baja: {baja.fecha}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BajasListado;