import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Footer } from '../Footer'
import { HeaderInst } from '../instructor/HeaderInst'
import { LoginScreen } from '../login/LoginScreen'
import { ForgotPassword } from '../login/ForgotPassword'

export const LoginRoutes = () => {
    return (
        <div>
            <HeaderInst />

            <div className="container">
                <Switch>
                    <Route path="/login/inicio" component={ LoginScreen } />
                    <Route path="/login/forgot" component={ ForgotPassword } />
                    <Redirect to="/login/inicio" />
                </Switch>
            </div>

            <Footer />
        </div>
    )
}
