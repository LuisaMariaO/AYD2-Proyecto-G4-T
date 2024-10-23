import { useNavigate } from "react-router-dom";

import logo from '../Imgs/logo_qnave.png'
function Index() {
    const navigate = useNavigate();
    const names = [
        { carnet: '202003381', nombre: 'Luisa María Ortíz Romero' },
        { carnet: '202000560', nombre: 'Marjorie Gissell Reyes Franco' },
        { carnet: '202000343', nombre: 'Luis Manuel Chay Marroquín' },
        { carnet: '202000173', nombre: 'Christian Alessander Blanco González' },
        { carnet: '201900576', nombre: 'Brayan Alexander Mejia Barrientos' },
    ];
    return (
        <div className='container'>
            <div className='row'>
                <div className="row text-center p-3 d-flex justify-content-center align-items-center">
                    <div className="col-lg-6 col-md-6">
                        <img src={logo} alt='Qnave'></img>
                        <div className="row m-3">
                            <button className="btn btn-danger w-100" onClick={() => navigate('/login-user')}>Iniciar Sesión</button>
                        </div>
                        <div className="row m-3">
                            <button className="btn btn-danger w-100" onClick={() => navigate('/loginConductor')}>Iniciar Sesión Conductor</button>
                        </div>
                        <div className="row m-3">
                            <button className="btn btn-danger w-100" onClick={() => navigate('/inicio-sesion-asistente')}>Iniciar Sesión Asistente</button>
                        </div>
                        <div className="row m-3">
                            <button className="btn btn-danger w-100" onClick={() => navigate('/login-admin')}>Iniciar Sesión Administrador</button>
                        </div>
                        <div className="row mx-1">
                            <div className="col-md-6 col-lg-6">
                                <button className="btn btn-dark w-100" onClick={() => navigate('/register-user')}>Registro Usuario</button>
                            </div>
                            <div className="col-md-6 col-lg-6">
                                <button className="btn btn-dark w-100" onClick={() => navigate('/register-driver')}>Registro Conductor</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row justify-content-center align-items-center'>
                    <div className='col-6'>
                        <div className="table-responsive center mt-3">
                            <table className="table table-striped table-bordered text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Carnet</th>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {names.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.carnet}</td>
                                            <td>{item.nombre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;