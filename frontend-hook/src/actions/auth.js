import { types } from "../types/types";
import { idInstructorAsignado } from "./idInstructor";
import { finishLoading, startLoading } from "./ui";

import { uri } from "../config";

import axios from "axios";
import Swal from "sweetalert2";


export const idUsuarioAsignado = ( idUsuario ) => ({
    type: types.idUsuarioAsignado,
    payload: {
        idUsuario: idUsuario
    }
})

export const startLoginEmailPassword = ( user, password ) => {
    return async ( dispatch ) => {
        dispatch( startLoading() );

        const credenciales = {
            username: user,
            password: password
        }

        try {
            const resp = await axios.post(`${uri}/users/user/login`, credenciales)
            const estado = resp.data?.estado;
            
            if (estado === "success" && resp.data.data.habilitado){
                const {username, id, id_perfil, correo, habilitado, cambiopass, acepto_terminos} = resp.data.data;
                dispatch( login( username, id, id_perfil, correo, habilitado, cambiopass, acepto_terminos) );
    
                try{
                    if( id !== undefined){
                        const res = await axios.get(`${uri}/instructores/usuario/${id}`);
                        const instructorSelected = res.data.data;

                        dispatch ( idInstructorAsignado( instructorSelected ) );
                    }
                }
                catch(error){
                    console.log('Hubo un error al obtener datos del instructor');
                }
            }    
            else{

                await axios.post(`${uri}/auditoria/`, {id_usuario: resp.data?.data.id} );
                
                Swal.fire({
                    title: 'Error!',
                    text: 'Hubo un error, verifique',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Error en la password o la contraseña',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        
        dispatch( finishLoading() );
    }
} 

export const login = ( user, idUsuario, id_perfil, correo, habilitado, cambiopass, acepto_terminos ) => ({
        type: types.login,
        payload: {
            usuario: user,
            idUsuario: idUsuario,
            id_perfil: id_perfil,
            correo: correo,
            habilitado: habilitado,
            cambioPass: cambiopass,
            acepto_terminos: acepto_terminos
        }
})

export const logout = () => ({
    type: types.logout
})


export const startChecking = () => {
    return async (dispatch) =>{

        const res = await axios.get(`${uri}/jwt/`);
        const body = await res.data;


        if( body.ok && body.usuario.habilitado ){
            const {username, id, id_perfil, correo, habilitado, cambiopass, acepto_terminos} = body.usuario;
            dispatch( login( username, id, id_perfil, correo, habilitado, cambiopass, acepto_terminos) )

            if(id_perfil === 5){
                try{
                    if( id !== undefined){
                        const response = await axios.get(`${uri}/instructores/usuario/${id}`);
                        const instructorSelected = response.data.data;
                        dispatch ( idInstructorAsignado( instructorSelected ) );
                    }
                }
                catch(error){
                    console.log('Hubo un error al obtener datos del instructor');
                }
            }
        }
        else{
            dispatch( checkingFinish() )
        }

    }
}

export const checkingFinish = () => ({ type: types.authCheckingFinish });

export const startLogout = () => {
    return async (dispatch) => {
        await axios.get(`${uri}/jwt/removeCookies/`);
        dispatch( logout() )
    }
}

