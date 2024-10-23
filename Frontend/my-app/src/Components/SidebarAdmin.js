function SidebarAdmin() {
    return (
        <div class="col-auto col-md-3 col-xl-2 bg-dark">
            <div class="d-flex flex-column align-items-center align-items-sm-start ps-3 pt-4 text-white min-vh-100">
                <a href="/admin" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <h2 class="d-none d-sm-inline  font-weight-bold">Menú</h2>
                </a>

                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li>
                        <a href="/admin" class="nav-link align-middle px-0 text-white">
                            <i class="bi bi-house"></i> <span class="ms-1 d-none d-sm-inline">Home</span> </a>
                    </li>
                    <li>
                        <a href="/contratar-asistente" class="nav-link align-middle px-0 text-white">
                            <i class="bi bi-calendar-check"></i> <span class="ms-1 d-none d-sm-inline">Contratar Asistentes</span> </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarAdmin;