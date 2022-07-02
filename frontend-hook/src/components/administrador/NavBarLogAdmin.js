import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../actions/auth.js';


export const NavBarLogAdmin = () => {

    const dispatch = useDispatch()
    

    const handleLogout = (e) => {
        e.preventDefault();

        dispatch( logout() );
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                 <div className="navWeb">
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/home">Inicio</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/usuarios">Usuarios</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/materiales">Materiales</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/programa">Programas</NavLink>
                    <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/novedades">Gestor de Novedades</NavLink>
                </div>

                <div className="dropdown menuResponsive">
                    <span className="navbar-toggler-icon" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    </span>
                    <ul className="dropdown-menu ms-5 dropdownAdmin" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/home">Inicio</NavLink>
                        </li>
                        <li>
                            <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/usuarios">Usuarios</NavLink>
                        </li>
                        <li>
                            <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/materiales">Materiales</NavLink>
                        </li>
                        <li>
                            <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/programa">Programas</NavLink>
                        </li>
                        <li>
                            <NavLink exact activeClassName="active" className="navbar-brand" to="/session/admin/novedades">Gestor de Novedades</NavLink>
                        </li>
                    </ul>
                </div>

                <div className="dropdown">
                    <button type="button" className="btn btn-danger" onClick={ handleLogout }>Cerrar sesion</button>
                </div>
            </div>
        </nav>
    )
}
