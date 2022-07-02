import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Redirect,
    Switch
  } from "react-router-dom";
import { LoginRoutes } from '../routes/LoginRoutes.js';
import { PublicRoute } from './PublicRoutes.js';
import { PrivateRoute } from './PrivateRoutes.js';
import { RedirectAdminUser } from './RedirectAdminUser.js';
import { startChecking } from '../../actions/auth.js';


export const RouterApp = () => {

    // TO PROD
    const {idUsuario} = useSelector(state => state.auth);

    // TO TEST THE PORTAL
    /* const idUsuario = 1; */


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch( startChecking() );
    }, []);



    return (
        <Router>
            <Switch>
                <PublicRoute
                    path='/login' 
                    component={ LoginRoutes }
                    isAuthenticated={ !!idUsuario }
                />
                <PrivateRoute 
                    path='/session'
                    isAuthenticated={ !!idUsuario }
                    component={ RedirectAdminUser }
                />
                <Redirect to="/login" />
            </Switch>
        </Router>
    )
}


