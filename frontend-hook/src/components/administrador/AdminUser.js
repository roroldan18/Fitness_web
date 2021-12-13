import React, { useState } from 'react'
import { AddUser } from './AddUser'
import { GetUsers } from './GetUsers'

export const AdminUser = () => {

    const [stateUser, setStateUser] = useState({
        add: false,
        get: false
    });
    
    const handleAdd = () => {
        setStateUser({
            add: true,
            get: false
        })
    }
    const handleGet = () => {
        setStateUser({
            add: false,
            get: true
        })
    }

    return (
        <>
            <div className="mt-5">
                <h1>Usuarios</h1>
                <hr />
            </div>

            <div className="btn-group m-3 " role="group" aria-label="Basic example">
                <button type="button" className="btn btn-close-white btn-outline-danger btn-lg" onClick={ handleAdd }>Nuevo usuario</button>
                <button type="button" className="btn btn-close-white btn-outline-danger btn-lg" onClick={ handleGet }>Listar Usuarios</button>
            </div>

            <div>
                {(stateUser.add) && <AddUser />}
                {(stateUser.get) && <GetUsers />}
            </div>
        </>
    )
}
