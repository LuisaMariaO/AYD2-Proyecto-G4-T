function SidebarAdmin() {
    return (
        <div className="col-auto col-md-3 col-xl-2 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start ps-3 pt-4 text-white min-vh-100">
                <a href="/admin" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <h2 className="d-none d-sm-inline  font-weight-bold">Menú</h2>
                </a>

                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li>
                        <a href="/admin" className="nav-link align-middle px-0 text-white">
                            <i className="bi bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span> </a>
                    </li>
                    <li>
                        <a href="/contratar-asistente" className="nav-link align-middle px-0 text-white">
                            <i className="bi bi-folder-plus"></i> <span className="ms-1 d-none d-sm-inline">Contratar Asistentes</span> </a>
                    </li>
                    <li>
                        <a href="/baja-asistente" className="nav-link align-middle px-0 text-white">
                            <i className="bi bi-x-circle"></i> <span className="ms-1 d-none d-sm-inline">Baja Asistentes</span> </a>
                    </li>
                    <li>
                        <a href="/ver-bajas" className="nav-link align-middle px-0 text-white">
                            <i className="bi bi-list-nested"></i> <span className="ms-1 d-none d-sm-inline">Historial Bajas</span> </a>
                    </li>
                    <li>
                        <a href="/reportes-admin" className="nav-link align-middle px-0 text-white">
                            <i className="bi bi-clipboard-data"></i> <span className="ms-1 d-none d-sm-inline">Reportes</span> </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarAdmin;