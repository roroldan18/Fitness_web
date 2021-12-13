import React from 'react';
import { Redirect, Route, Switch } from 'react-router'
import { Footer } from '../Footer'
import { HeaderInst } from '../instructor/HeaderInst'
import { NavBarLog } from '../instructor/NavBarLog'
import { NovedadesInst } from '../instructor/NovedadesInst'
import { PerfilInstructor } from '../instructor/PerfilInstructor'
import { SearchBar } from '../instructor/SearchBar'
import { MixesInst } from '../instructor/MixesInst';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { uri } from '../../config';
import Swal from 'sweetalert2';
import { startChecking } from '../../actions/auth';
import { TerminosCondiciones } from '../instructor/TerminosCondiciones';


export const SessionRoutes = () => {
    
    const dispatch = useDispatch();
    const {id, nombre, apellido, telefono, direccion, pais, provincia, ciudad, fuerzaCompletaDatos} = useSelector(state => state.idInstructor);
    const {acepto_terminos} = useSelector(state => state.auth);


    const handleConfirmar = () => { 
        axios.put(`${uri}/instructores/${id}`, {fuerza_completa_datos: false})
            .then(res=> {
                Swal.fire(
                    'Modificacion exitosa!',
                    ``,
                    'success'
                    )
                dispatch( startChecking() );
            })
            .catch(error => console.log('Error al modificar los datos de instructor'));
    }
    

    return (
        <div>
            <HeaderInst />

            {
                (fuerzaCompletaDatos)
                &&
                <>
                <div className="container">
                    <h1 className="text-center"><b>Inicialmente tendrás que validar y cargar tus datos personales para continuar</b></h1>
                    
                    <Switch>
                        <Route exact path="/session/perfil-instructores" component={ PerfilInstructor } />
                        <Redirect to="/session/perfil-instructores" />
                    </Switch>

                    {
                        (!nombre || !apellido || !telefono || !direccion || !pais || !provincia || !ciudad )
                        &&
                        <>
                        <button disabled className="myDIV">Confirmar</button>
                        <div className="hide">Debe completar todos los datos antes de confirmar</div> 
                        </>
                    }
                    {
                        (nombre && apellido && telefono && direccion && pais && provincia && ciudad )
                        &&
                        <button onClick={handleConfirmar}>Confirmar</button>
                    }

                </div>

                </>
            }

            {
                (!fuerzaCompletaDatos)
                &&
                (
                    (acepto_terminos)
                    ?
                    <>
                        <NavBarLog />
            
                        <div className="container contenidoSession">
                            <Switch>
                                <Route exact path="/session/novedades" component={ NovedadesInst } />
                                <Route exact path="/session/mixes-instructores" component={ MixesInst } />
                                <Route exact path="/session/perfil-instructores" component={ PerfilInstructor } />
                                <Route exact path="/session/busqueda" component={ SearchBar } />
                                <Redirect to="/session/novedades" />
                            </Switch>
                        </div>
            
                        <Footer />
                    </>
                    :
                    <TerminosCondiciones />
                )
            }

        </div>
    )
}
