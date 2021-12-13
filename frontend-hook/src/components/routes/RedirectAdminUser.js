import React from 'react';
import {
    BrowserRouter as Router,
    Switch
  } from "react-router-dom";
import { SessionRoutes } from './SessionRoutes';
import { AdminRoutes } from './AdminRoutes';
import { FirstLogin } from '../login/FirstLogin';
import { useSelector } from 'react-redux';


export const RedirectAdminUser = ({usuario}) => {

    const {id_perfil, cambioPass} = useSelector(state => state.auth)
    
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


