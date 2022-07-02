import React, { useState } from 'react'
import { CursosInstructorTomados } from './CursosInstructorTomados.js';
import { InfoPersonal } from './InfoPersonal.js';
import { MaterialUsuarioAsignado } from './MaterialUsuarioAsignado.js';

export const EditUser = (idUser) => {

    const idUsuario = idUser.location.state.idUser;

    const initialDisplay = {
        infoPersonal: false,
        cursosTomados: false,
        asignarMaterial: false,
    }

    const [display, setDisplay] = useState(initialDisplay)

    const handleDisplay = (cambio) => {
        setDisplay(initialDisplay);
        setDisplay({...initialDisplay, ...cambio})
    }
    
    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-dark btn-outline-light mediumFont m-4"  onClick={() => handleDisplay({infoPersonal: !display.infoPersonal})}>{(display.infoPersonal) ? "- Informacion Personal" : "+ Informacion Personal"}</button>
            </div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-dark btn-outline-light mediumFont m-4"  onClick={() => handleDisplay({cursosTomados: !display.cursosTomados})}>{(display.cursosTomados) ? "- Programas asignados" : "+ Programas asignados"}</button>
            </div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-dark btn-outline-light mediumFont m-4"  onClick={() => handleDisplay({asignarMaterial: !display.asignarMaterial})}>{(display.asignarMaterial) ? "- Materiales asignados" : "+ Materiales asignados"}</button>
            </div>

            {
                (display.infoPersonal)
                &&
                <InfoPersonal idUsuario={idUsuario} />
            }

            {
                (display.cursosTomados)
                &&
                <CursosInstructorTomados idUsuario={idUsuario} />
            }

            {
                (display.asignarMaterial)
                &&
                <MaterialUsuarioAsignado idUsuario={idUsuario}/>
            }


        </div>
    )
}
