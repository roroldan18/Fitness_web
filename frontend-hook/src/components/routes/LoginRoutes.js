import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Footer } from '../Footer.js'
import { HeaderInst } from '../instructor/HeaderInst.js'
import { LoginScreen } from '../login/LoginScreen.js'
import { ForgotPassword } from '../login/ForgotPassword.js'

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
