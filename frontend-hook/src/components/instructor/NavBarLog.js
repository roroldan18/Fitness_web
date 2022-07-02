import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { startLogout } from '../../actions/auth.js';
import { cursoElegido, noCurso } from '../../actions/idCurso.js';
import { eliminarIdInstructorAsignado } from '../../actions/idInstructor.js';
import { uri } from '../../config.js';

export const NavBarLog = () => {
    const dispatch = useDispatch()
    const idInstructor = useSelector(state => state.idInstructor.id)
    const [programas, setPrograma] = useState([]);

    const obtenerDatosPrograma = async (isMounted) => {
        try{
            if(idInstructor !== undefined){
                const res = await axios.get(`${uri}/instructores_cursos/instructor/${idInstructor}`);
                const listaCursosInstructor = res.data.data.instructorConCursos;
                if(isMounted){
                    setPrograma(listaCursosInstructor);
                }
            }
        }
        catch(error){
            console.log('Error al obtener datos del programa');
        }
    }

    useEffect(() => {   
        let isMounted = true; 
        obtenerDatosPrograma(isMounted);
        return () => {isMounted= false}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idInstructor])  ;

    

    const handleLogout = (e) => {
        e.preventDefault();

        dispatch( eliminarIdInstructorAsignado() )
        dispatch( noCurso() );
        dispatch( startLogout() );
    }

    const handlePrograma = (e) =>{
        dispatch( cursoElegido(e.id_curso) )
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                 <div className="navWeb">
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/novedades">Novedades</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/mixes-instructores">Mixes</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/busqueda">Buscador</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/perfil-instructores">Perfil</NavLink>
                </div>

                <div className="dropdown menuResponsive">
                    <span className="navbar-toggler-icon" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    </span>
                    <ul className="dropdown-menu ms-5" aria-labelledby="dropdownMenuButton1">
                        <NavLink exact activeClassName="active" className="navbar-brand" to="/session/novedades">Novedades</NavLink>
                        <NavLink exact activeClassName="active" className="navbar-brand" to="/session/mixes-instructores">Mixes</NavLink>
                        <NavLink exact activeClassName="active" className="navbar-brand" to="/session/busqueda">Buscador</NavLink>
                        <NavLink exact activeClassName="active" className="navbar-brand" to="/session/perfil-instructores">Perfil</NavLink>
                        <button className="btn" onClick={ handleLogout }><li>Cerrar Sesion</li></button>
                    </ul>
                </div>
                
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Programa
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {
                            programas?.map((programa, index) => 
                                <li key={index}><button className="dropdown-item" onClick={ () => handlePrograma(programa) } >{programa.curso.nombre}</button></li>
                                )
                        }
                    </ul>
                    <button type="button" className="btn btn-danger navWeb" onClick={ handleLogout }>Cerrar sesion</button>
                </div>
            </div>
        </nav>
    )
}
