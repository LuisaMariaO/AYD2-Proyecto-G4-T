import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../Imgs/carro.png'

function Navbar(prop) {

    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');

    const handeleCerrarSesion = async (e) => {
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        navigate('/')
    }

    const handleVerPerfil = async (e) => {
        navigate('/usuario/verPerfil')
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-danger navbar-danger text-light">
                <div className="container-fluid">
                    <a className="navbar-brand fs-4 text-light">
                        <img src={logo} alt="logo" style={{ width: "70px", borderRadius: '10px'}}></img>
                        &nbsp;
                        Qnave
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        </ul>
                        <div className="d-flex">
                            <div className="navbar-nav me-auto mb-2 mb-lg-0">
                                <div className="nav-item dropdown">
                                    <a className="nav-link text-light" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: "20px" }}>
                                        {username!=undefined ? name : prop.rol}  &nbsp;
                                        <i className="bi bi-person-circle" style={{ fontSize: "30px" }}> </i>
                                    </a>
                                    <ul class="dropdown-menu"> 
                                        <li><a class="dropdown-item" onClick={handleVerPerfil} href="">Ver perfil</a></li>
                                        <li><a class="dropdown-item" onClick={handeleCerrarSesion} href="">Cerrar sesión</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;