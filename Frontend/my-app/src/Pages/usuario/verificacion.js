import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Service from "../../Services/service";
import { useNavigate } from "react-router-dom";

function VerificarUsuario() {
    const navigate = useNavigate();

    const { username } = useParams();


    useEffect(() => {
        Service.verificarCuenta(username)
        .then(({}) => {
    
    
        })
        .catch((error) => {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al verificar la cuenta, por favor intente más tarde",
                icon: "error"
              });
              navigate("/")
        })
        return () => {
         
        };
      }, []);
    


    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ position: 'relative', padding: 0 }}>
            <div
                className="col-12"
                style={{
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1
                }}
            ></div>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '20px',
                zIndex: 2
            }}></div>
            <div className="col-12 bg-dark row justify-content-center py-5" style={{ position: 'relative', zIndex: 2, width: '600px', borderRadius: '20px' }}>
                <div className="col-md-9 col-lg-9 text-center">
                    <h2 className="text-light text-center">¡Cuenta verificada!</h2>
                    <button className="btn btn-success" onClick={()=>navigate("/login-user")}>Ir al inicio de sesión</button>
                </div>
            </div>


        </div>
    );
}

export default VerificarUsuario;
