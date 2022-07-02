import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { startChecking } from '../../actions/auth.js';
import { textTermsAndCond, uri } from '../../config.js';



export const TerminosCondiciones = () => {

    const {idUsuario} = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const handleTerms = (acepta) => {
        if(acepta){
            axios.put(`${uri}/users/terminos/${idUsuario}`)
                .then(res => {
                    dispatch( startChecking() );
                    window.location.reload();
                })
                .catch(error => console.log('Error al procesar la solicitud de terminos y condiciones'))
        }
        if(!acepta){
            Swal.fire({
                text: 'Debe aceptar los términos y condiciones para ingresar a la plataforma',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
    }

    return (
        <div className="container mt-4">
            <h1>Términos y condiciones para el instructor</h1>
            <div className="termsAndCond" > { textTermsAndCond } </div>
            <div className="fa-pull-right">
                <button className="btn btn-outline-light m-3" onClick={() => handleTerms(true)}>Aceptar</button>
                <button className="btn btn-outline-light m-3" onClick={() => handleTerms(false)}>Rechazar</button>
            </div>
        </div>
    )
}
