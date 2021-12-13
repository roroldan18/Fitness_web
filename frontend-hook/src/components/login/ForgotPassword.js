import axios from 'axios';
import React from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { uri } from '../../config';
import { useForm } from '../../hooks/useForm';

export const ForgotPassword = () => {

    const [ formValues, handleInputChange ] = useForm();

    const handleResetPassword = (e) => {
        e.preventDefault();

        const emailRecuperar = {
            email: formValues.correo
        }
        
        axios.post(`${uri}/users/user/email`, emailRecuperar)
            .then(res => {
                const idUsuario = res.data.data.usuario.id;

                Swal.fire({
                    title: 'Se le enviará un correo con las credenciales para ingresar, está seguro que desea recuperarla?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, recuperar!'
                    })
                        .then((result) => {
                            if (result.isConfirmed) {
                                axios.put(`${uri}/users/reseteoPass/${idUsuario}`)
                                    .then(res => {
                                        Swal.fire(
                                            'Recuperación exitosa!',
                                            `Se le ha enviado un correo con las nuevas credenciales!`,
                                            'success'
                                        )
                                    })
                                    .catch(error => console.log('Error al resetear la password'));
                        }})
                        .catch(error => console.log('No se aceptó la solicitud'));
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Parece que tu email no está registrado!'
                  })
            });
}

    return (
        <div>
              <div className="container mt-5 flex-col-center">
                <h1 className="display-3">Olvidé mi contraseña</h1>
                <hr />

                <form onSubmit={ handleResetPassword } className="formLogin">
                    <label>Ingrese su email</label>
                    <input 
                    type="text"
                    placeholder="correo@example.com" 
                    name="correo"
                    className="auth__input"
                    autoComplete="off"
                    onChange={ handleInputChange }
                    />

                    <div className="d-flex flex-row-reverse">
                        <Link to="/login/inicio" className="text-decoration-none btn btn-close-white"><h4>Volver al inicio de sesión</h4></Link>
                    </div>

                    <button 
                    type="submit" 
                    className="btn btn-outline-danger"
                    >
                    Restablecer
                    </button>

                    

                </form>
            </div>
        </div>
    )
}
