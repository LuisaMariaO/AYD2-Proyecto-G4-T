import { Link } from 'react-router-dom';


function SidebarConductor() {
    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <h4 className="my-4 text-white">Conductor</h4>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <Link to="/conductor" className="nav-link align-middle px-0">
                            <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Inicio</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/perfil-conductor" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Perfil</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/gestionar-viajes" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-truck"></i> <span className="ms-1 d-none d-sm-inline">Gestionar Viajes</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/reportar-problema" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-exclamation-circle"></i> <span className="ms-1 d-none d-sm-inline">Reportar Problema</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/ganancias" className="nav-link px-0 align-middle">
                        <i className="fs-4 bi-currency-dollar"></i> <span className="ms-1 d-none d-sm-inline">Ganancias</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarConductor;
