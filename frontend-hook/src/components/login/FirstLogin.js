import React from 'react';
import { useForm } from '../../hooks/useForm.js';
import { Footer } from '../Footer.js';
import Swal from 'sweetalert2';
import { HeaderInst } from '../instructor/HeaderInst.js';
import { uri } from '../../config.js';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const FirstLogin = () => {

    const { idUsuario } = useSelector(state => state.auth);
    const [ formValues, handleInputChange ] = useForm();

    console.log(formValues);

    const handleChangePassword = (e) => {
        e.preventDefault();
        if(formValues.password.length < 8){
            return(
                Swal.fire({
                    title: 'Error!',
                    text: 'La clave debe tener un mínimo de 8 caracteres',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            )
        }
        else if ( !formValues.password.match(/[A-z]/) ){
            return(Swal.fire({
                title: 'Error!',
                text: 'La clave debe tener al menos una letra',
                icon: 'error',
                confirmButtonText: 'OK'
              })
              )
        }
        else if ( !formValues.password.match(/[A-Z]/) ){
            return(Swal.fire({
                title: 'Error!',
                text: 'La clave debe tener al menos una letra mayúscula',
                icon: 'error',
                confirmButtonText: 'OK'
              })
              )
        }
        
        else if ( !formValues.password.match(/\d/) ) {
            return(Swal.fire({
                title: 'Error!',
                text: 'La clave debe tener al menos un número',
                icon: 'error',
                confirmButtonText: 'OK'
              })
            )
        }

        else if(formValues.password !== formValues.password2){
            return(Swal.fire({
                title: 'Error!',
                text: 'Las claves deben coincidor',
                icon: 'error',
                confirmButtonText: 'OK'
              })
            )
        }
        
        else{
            const password = {
                password1: formValues.password,
                password2: formValues.password2
            }

            axios.put(`${uri}/users/cambioPass/${idUsuario}`, password)
                .then(res => {
                    Swal.fire(
                        'Modificacion exitosa!',
                        `Tu clave ha sido modificada con éxito!`,
                        'success'
                        )
                    setTimeout(window.location.reload(), 2000);
                    })
                .catch(error => console.log('Error al efectuar el cambio de password'));
        }
    }

    const { loading } = useSelector( state => state.ui );

    return (
        <div>
            <HeaderInst/>

            <div className="container mt-5 flex-col-center">    
                <form onSubmit={ handleChangePassword } className="formLogin">
                    <h2>En tu primer inicio de sesión debes cambiar la contraseña</h2>
                    <label className="mediumFont">Crear nueva contraseña</label>
                    <input 
                    type="password"
                    placeholder="Nueva contraseña" 
                    name="password"
                    className="auth__input"
                    autoComplete="off"
                    onChange={ handleInputChange }
                    />
                    <label className="mediumFont">Repetir la contraseña</label>
                    <input 
                    type="password"
                    placeholder="Repetir la contraseña" 
                    name="password2" 
                    className="auth__input"
                    autoComplete="off"
                    onChange={ handleInputChange }
                    />

                    <button 
                    type="submit" 
                    className="btn btn-danger btn-block"
                    disabled={ loading }
                    >
                    Confirmar
                    </button>
                    <hr/>

                    <h6>Requisitos: </h6>
                    <ul>
                        <li>8 caracteres.</li>
                        <li>Al menos una letra.</li>
                        <li>Al menos un número.</li>
                        <li>Al menos una mayúscula.</li>
                    </ul>    

                </form>
            </div>

            <Footer />
        </div>
    )
}
