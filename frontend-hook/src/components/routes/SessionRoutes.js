import React from 'react';
import { Redirect, Route, Switch } from 'react-router'
import { Footer } from '../Footer.js'
import { HeaderInst } from '../instructor/HeaderInst.js'
import { NavBarLog } from '../instructor/NavBarLog.js'
import { NovedadesInst } from '../instructor/NovedadesInst.js'
import { PerfilInstructor } from '../instructor/PerfilInstructor.js'
import { SearchBar } from '../instructor/SearchBar.js'
import { MixesInst } from '../instructor/MixesInst.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { uri } from '../../config.js';
import Swal from 'sweetalert2';
import { startChecking } from '../../actions/auth.js';
import { TerminosCondiciones } from '../instructor/TerminosCondiciones.js';


export const SessionRoutes = () => {
    
    const dispatch = useDispatch();
    const {id, nombre, apellido, telefono, direccion, pais, provincia, ciudad, fuerzaCompletaDatos} = useSelector(state => state.idInstructor);

    //TO PROD
    const {acepto_terminos} = useSelector(state => state.auth);

   // TO TEST PORTAL
  /*  const acepto_terminos = true; */


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
