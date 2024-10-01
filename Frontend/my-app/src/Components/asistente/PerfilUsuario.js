import React from 'react';
import { Card } from 'react-bootstrap';


const PerfilUsuario = ({ usuario }) => {

    return (
        <>
            <div className="d-flex flex-column align-items-center mb-4">
                <div className="mb-3">
                    <img
                        src={usuario.url_foto ? usuario.url_foto : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'}
                        alt={usuario.username}
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px' }}
                    />
                </div>
                <div>

                    <Card className="w-100">
                        <Card.Header>Frase motivacional</Card.Header>
                        <Card.Body>
                            <h3>{usuario.frase}</h3>
                            <p className="text-muted">{usuario.autor}</p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default PerfilUsuario;