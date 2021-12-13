import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Redirect,
    Switch
  } from "react-router-dom";
import { LoginRoutes } from '../routes/LoginRoutes';
import { PublicRoute } from './PublicRoutes';
import { PrivateRoute } from './PrivateRoutes';
import { RedirectAdminUser } from './RedirectAdminUser';
import { startChecking } from '../../actions/auth';


export const RouterApp = () => {

    const {idUsuario} = useSelector(state => state.auth);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch( startChecking() );
    }, [dispatch]);


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


