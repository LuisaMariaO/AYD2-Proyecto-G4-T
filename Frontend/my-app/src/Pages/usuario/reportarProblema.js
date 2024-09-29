import { React, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarUsuario";
import Service from "../../Services/service";
import Swal from 'sweetalert2';

function ReportarProblema() {
  const username = localStorage.getItem('username');
    const [esConductor, setEsConductor] = useState(true);
    const [formData, setFormData] = useState({
        nombre: null,
        placa: null,
        descripcion: null,
        fecha: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit =  (e) => { 
      e.preventDefault();
      for(let key in formData){
        if(formData[key]==''){
          formData[key]=null
        }
      }
      
      Service.reportarProblemaUsuario(formData.descripcion!='', formData.fecha, formData.nombre, formData.placa, username)
            .then(({ message}) => {

                Swal.fire({
                    title: "¡Reporte enviado!",
                    text: "Tus reportes nos ayudan a mejorar Qnave.",
                    icon: "success"
                  }).then(() => {
                  limpiarFormulario()
                  });

            })
            .catch((error) => {
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al realizar el reporte, por favor intente más tarde",
                    icon: "error"
                  });
            })
    };

    const limpiarFormulario = () => {
        setFormData({
          nombre: '',
          placa: '',
          descripcion: '',
          fecha: '',
        });
    }
    return (
        <>
            <Navbar rol="Usuario" />
<div className="container-fluid">
  <div className="row">
    <Sidebar />
    <div className="col">
      <div className="py-3 px-3 pt-3 text-center">
        <h1>Reportar un problema</h1>
      </div>
      <div className="container mt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tipo" className="form-label">Tipo de Problema</label>
            <select
              className="form-select"
              id="tipo"
              onChange={(e) => setEsConductor(e.target.value === 'conductor')}
            >
                <option value="conductor">Conductor</option>
                <option value="otro">Otro</option>
              
            </select>
          </div>

          {esConductor && (
            <>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre del Conductor</label>
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
                <label htmlFor="placa" className="form-label">Número de Placa</label>
                <input
                  type="text"
                  className="form-control"
                  id="placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción del Problema</label>
            <textarea
              className="form-control"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>

          {!esConductor && (
            <div className="mb-3">
              <label htmlFor="fecha" className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="btn btn-success">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</div>

        </>
    );
}

export default ReportarProblema;