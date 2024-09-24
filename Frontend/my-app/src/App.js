import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Index from "./Pages";
import Login from "./Pages/login";
import Asistente from "./Pages/asistente/asistente";
import Usuario from "./Pages/usuario/usuario";
import Conductor from "./Pages/conductor/conductor";
import RegistroUsuario from "./Pages/usuario/registro";
import RegistroConductor from "./Pages/conductor/registro";
import Administrador from "./Pages/admin/admin";
import GestionarViajes from './Pages/conductor/GestionarViajes';
import ReportarProblema from './Pages/conductor/ReportarProblema';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/asistente" element={<Asistente/>}></Route>
      <Route path="/usuario" element={<Usuario/>}></Route>
      <Route path="/conductor" element={<Conductor/>}></Route>
      <Route path="/admin" element={<Administrador/>}></Route>
      <Route path="/register-user" element={<RegistroUsuario/>}></Route>
      <Route path="/register-driver" element={<RegistroConductor/>}></Route>
      <Route path="/gestionar-viajes" element={<GestionarViajes/>}></Route>
      <Route path="/reportar-problema" element={<ReportarProblema/>}></Route>
      <Route path="*" element={<Navigate to="/" replace={true}></Navigate>} exact={true}></Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
