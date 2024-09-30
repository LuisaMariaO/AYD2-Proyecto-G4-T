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

    return (
        <>
            <nav class="navbar navbar-expand-lg bg-danger navbar-danger text-light">
                <div class="container-fluid">
                    <a class="navbar-brand fs-4 text-light">
                        <img src={logo} alt="logo" style={{ width: "70px", borderRadius: '10px'}}></img>
                        &nbsp;
                        Qnave
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                        </ul>
                        <div class="d-flex">
                            <div class="navbar-nav me-auto mb-2 mb-lg-0">
                                <div class="nav-item dropdown">
                                    <a class="nav-link text-light" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: "20px" }}>
                                        {username!=undefined ? name : prop.rol}  &nbsp;
                                        <i class="bi bi-person-circle" style={{ fontSize: "30px" }}> </i>
                                    </a>
                                    <ul class="dropdown-menu"> 
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