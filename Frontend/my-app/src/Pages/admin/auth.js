import React, { useState } from "react";
import Swal from 'sweetalert2';
import fondo from '../../Imgs/fondo.jpeg';
import Service from "../../Services/service";
import { useNavigate } from "react-router-dom";

function Auth() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleValidate = () => {
        if (file && file.name.endsWith('.ayd')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const storedValue = localStorage.getItem('usuario');
                Service.auth(storedValue, e.target.result)
                    .then(({ success, res }) => {
                        if (success && res.length > 0) {
                            navigate("/admin");
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'Usuario o contraseña incorrectos',
                                icon: 'error',
                                confirmButtonText: 'Ok'
                            })
                        }
                    });
            };
            reader.readAsText(file);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona un archivo .ayd',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
    };

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
                <div className="col-md-9 col-lg-9">
                    <h2 className="text-light text-center">Autenticación</h2>
                    <form>
                        <div className="my-4">
                            <input
                                className="form-control bg-secondary"
                                type="file"
                                id="formFile"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button
                                type="button"
                                className="btn btn-danger btn-block mx-1 mt-3"
                                onClick={handleValidate}
                            >
                                Validar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Auth;
