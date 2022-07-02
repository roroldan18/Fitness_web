import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { AddSistema } from '../administrador/AddSistema.js'
import { AdminHome } from '../administrador/AdminHome.js'
import { AdminMateriales } from '../administrador/AdminMateriales.js'
import { AdminNovedades } from '../administrador/AdminNovedades.js'
import { AdminUser } from '../administrador/AdminUser.js'
import { EditMix } from '../administrador/EditMix.js'
import { EditUser } from '../administrador/EditUser.js'
import { InstructoresMix } from '../administrador/InstructoresMix.js'
import { NavBarLogAdmin } from '../administrador/NavBarLogAdmin.js'
import { Footer } from '../Footer.js'
import { HeaderInst } from '../instructor/HeaderInst.js'

export const AdminRoutes = () => {
    return (
        <div>
            <HeaderInst />

            <NavBarLogAdmin />

            <div className="contenidoSession m-5">
                <Switch>
                    <Route exact path="/session/admin/home" component={ AdminHome } />
                    <Route exact path="/session/admin/usuarios" component={ AdminUser } />
                    <Route exact path="/session/admin/materiales" component={ AdminMateriales } />
                    <Route exact path="/session/admin/materiales/:mix" component={ EditMix } />
                    <Route exact path="/session/admin/instructores/:mix" component={ InstructoresMix } />
                    <Route exact path="/session/admin/usuarios/:usuario" component={ EditUser } />
                    <Route exact path="/session/admin/programa" component={ AddSistema } />
                    <Route exact path="/session/admin/novedades" component={ AdminNovedades } />
                    <Redirect to="/session/admin/home" />
                </Switch>
            </div>

            <Footer />
        </div>
    )
}
