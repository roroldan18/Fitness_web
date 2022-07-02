import React from 'react';
import {
    BrowserRouter as Router,
    Switch
  } from "react-router-dom";
import { SessionRoutes } from './SessionRoutes.js';
import { AdminRoutes } from './AdminRoutes.js';
import { FirstLogin } from '../login/FirstLogin.js';
import { useSelector } from 'react-redux';



export const RedirectAdminUser = ({usuario}) => {

    // TO PROD
    const {id_perfil, cambioPass} = useSelector(state => state.auth)


    //TO TEST THE PORTAL (4 ADMIN, other number USER)
/*     const id_perfil = 4
    const cambioPass = true */
    
    return (
        <Router>
            <Switch>
                {   
                    (id_perfil === 4)
                    ?
                    <AdminRoutes />
                    :
                    (
                        (!cambioPass)
                        ?
                        <FirstLogin usuario={usuario} />
                        :
                        <SessionRoutes usuario={usuario} />
                    )
                }
            </Switch>
        </Router>
    )
}


