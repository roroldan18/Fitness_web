import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { startLoginEmailPassword } from '../../actions/auth';
import { useForm } from '../../hooks/useForm';

export const LoginScreen = () => {

    const dispatch = useDispatch();

    const showPassword = () => {
        const pass = document.getElementById("passLogin");
        if (pass.type === "password") {
            pass.type = "text";
        } else {
            pass.type = "password";
            }
    }

    const [ formValues, handleInputChange ] = useForm({
        user: '',
        password: ''
    });

    const { user, password } = formValues;

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch( startLoginEmailPassword( user, password ) );
    }

    const { loading } = useSelector( state => state.ui );
    const { checking } = useSelector( state => state.auth );



    if( loading ){
        return (
            <div className="container mt-5 flex-col-center">
                <h1 className="display-3">Por favor, espere...</h1>
            </div>
        )
    }



    if( checking ){
        return (
            <div className="container mt-5 flex-col-center">
                <h1 className="display-3">Por favor, espere...</h1>
            </div>
        )
    }

    return (
        <div>
            <div className="container mt-5 flex-col-center">
                <h1 className="display-3">Ingresar al sistema de instructores</h1>
                <hr />

                <form onSubmit={ handleLogin } className="formLogin">

                    <label>Usuario</label>

                    <input 
                    type="text"
                    placeholder="Usuario" 
                    name="user"
                    className="auth__input"
                    autoComplete="off"
                    value= { user }
                    onChange={ handleInputChange }
                    />

                    <label>Contraseña</label>
                    <input 
                    type="password"
                    placeholder="Contraseña" 
                    name="password" 
                    id="passLogin"
                    className="auth__input"
                    value= { password }
                    onChange={ handleInputChange }
                    />

                    <div className="d-flex m-0">
                        <input type="checkbox" onClick={showPassword} /> 
                        <p className="m-1">Ver contraseña</p>
                    </div>

                    <div className="d-flex flex-row-reverse">
                        <Link to="/login/forgot" className="text-decoration-none btn btn-close-white"><h4>Olvidé mi contraseña</h4></Link>
                    </div>
                

                    <button 
                    type="submit" 
                    className="btn btn-danger btn-block"
                    disabled={ loading }
                    >
                    Ingresar
                    </button>
            
                    
                </form>

            </div>
        </div>
    )
}
