import React from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/SidebarUsuario";

function Usuario() {
    return (
        <>
            <Navbar rol="Usuario"/>
            <div class="container-fluid">
                <div class="row flex-nowrap">
                    <Sidebar></Sidebar>
                    <div class="col py-3 px-3 pt-3">
                        <h1>¡Bienvenida/o Usuario!</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Usuario;