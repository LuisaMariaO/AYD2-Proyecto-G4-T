import { React, useState, useEffect } from "react";
import PieChartDemo from '../../Components/pie';
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarAdmin";
import Service from "../../Services/service";
import BarsChart from '../../Components/BarsChart';

function AdminReportes() {
    const [porcentajes, setPorcentajes] = useState([{ label: "Cargando", value: 100 }]);
    const [promedios, setPromedios] = useState([{ label: "Cargando", value: 100 }]);

    useEffect(() => {
        Service.promedioCalificacionConductor()
            .then(({ success, data }) => {
                if (success) {
                    setPromedios(data)
                }
            })
            .catch((error) => {
                throw error
            })
        Service.viajesPorEstado()
            .then(({ success, data }) => {
                if (success) {
                    setPorcentajes(data)
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
                    <div className="col mt-3 py-3 px-3 pt-3">
                        <h2>Reportes</h2>
                        <div className="row mt-3">
                            <div className='col-md-5'>
                                <PieChartDemo
                                    data={porcentajes}
                                    graphTitle="Porcentaje de viajes por estado" />
                            </div>

                            <div className='col-md-5'>
                                <BarsChart
                                    data={promedios}
                                    graphTitle={"Promedio de calificación por conductor"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminReportes;