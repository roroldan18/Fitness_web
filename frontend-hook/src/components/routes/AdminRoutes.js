import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { AddSistema } from '../administrador/AddSistema'
import { AdminHome } from '../administrador/AdminHome'
import { AdminMateriales } from '../administrador/AdminMateriales'
import { AdminNovedades } from '../administrador/AdminNovedades'
import { AdminUser } from '../administrador/AdminUser'
import { EditMix } from '../administrador/EditMix'
import { EditUser } from '../administrador/EditUser'
import { InstructoresMix } from '../administrador/InstructoresMix'
import { NavBarLogAdmin } from '../administrador/NavBarLogAdmin'
import { Footer } from '../Footer'
import { HeaderInst } from '../instructor/HeaderInst'

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
