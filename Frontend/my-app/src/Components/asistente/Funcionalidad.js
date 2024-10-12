import React from 'react';
import { Button } from 'react-bootstrap';
import { Settings, SquareUser, SquareArrowDown, Users, Edit, CirclePercent } from 'lucide-react';

const iconos = {
    settings: <Settings className="me-2" />,
    SquareUser: <SquareUser className="me-2" />,
    edit: <Edit className="me-2" />,
    SquareArrowDown: <SquareArrowDown className="me-2" />,
    Users: <Users className="me-2" />,
    CirclePercent: <CirclePercent className="me-2" />
};

const Funcionalidad = ({ icon, texto, link, action, onClick }) => {
    return (
        <>
            <Button variant="outline-dark" className="w-100 mb-3 d-flex align-items-center" href={link} onClick={onClick}>
                {iconos[icon]}
                {texto}
            </Button>
        </>
    );
};

export default Funcionalidad;