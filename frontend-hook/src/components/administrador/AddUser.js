import React, { useEffect, useState } from 'react'
import { useForm } from '../../hooks/useForm';
import Swal from 'sweetalert2';
import { countries } from '../../database/countries';
import axios from 'axios';
import { uri } from '../../config';


export const AddUser = () => {

    const [cursos, setCursos] = useState([]);


    const handleCursos = (isMounted) => {
        axios.get(`${uri}/cursos/`).then(res => {
            const cursos = res.data.data.cursos;
            if(isMounted){
                setCursos(cursos)
            }
        })
    }

    useEffect(() => {
        let isMounted = true;
        handleCursos(isMounted);
        return () => {
            isMounted=false;
        }
    }, [])

    
    
    const [formValues, handleInputChange, reset ] = useForm();

    const handleSubmit = () => {
        if(formValues.username.toLocaleLowerCase() !== formValues.username2.toLocaleLowerCase()){
            Swal.fire({
                title: 'Error!',
                text: 'Los usuarios deben coincidir',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else if ( !formValues.id_perfil  || !formValues.username || !formValues.username2 || !formValues.correo ){
            Swal.fire({
                title: 'Error!',
                text: 'Se deben completar todos los datos de alta de Usuario',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else if (formValues.id_perfil === '5'){
            if ( !formValues.nombre || !formValues.apellido || !formValues.id_curso || !formValues.pais ){
                Swal.fire({
                    title: 'Error!',
                    text: 'Se deben completar todos los datos con *',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
            }
            else {
                axios.post(`${uri}/users/`, formValues)
                    .then(res => {
                    const instructorName = res.data.nombre;
                    const instructorLastname = res.data.apellido;
                
                Swal.fire(
                    'Alta exitosa!',
                    `El instructor ${instructorName} ${instructorLastname} ha sido añadido!`,
                    'success'
                  )
                document.getElementById("formularioAltaUsuario").reset();
                reset();
            })
                    .catch(err => {
                        Swal.fire({
                            title: 'Error!',
                            text: err.response.data.mensaje,
                            icon: 'error',
                            confirmButtonText: 'OK'
                          })
                    })
            }
        }
        else{
            axios.post(`${uri}/users/`, formValues)
                .then(res => {
                const usuario = res.data.username;
                
                Swal.fire(
                    'Alta exitosa!',
                    `El usuario ${usuario} ha sido añadido!`,
                    'success'
                  )
                document.getElementById("formularioAltaUsuario").reset();
                reset();
            })
                .catch(err => {
                    Swal.fire({
                        title: 'Error!',
                        text: err.response.data.error,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                })
        }
    }



    return (
        <>
            <div className="container mt-4">
                <h1>Cargue los datos para crear un usuario nuevo</h1>
            </div>

            <form onSubmit={ handleSubmit } className="form-check mediumFont" id="formularioAltaUsuario">
                <div className="mb-3">
                    <label >Usuario</label>
                    <input type="text" className="form-control mediumFont" name="username" placeholder="usuario o email" onChange={ handleInputChange } />
                </div>

                <div className="mb-3">
                    <label >Repita el usuario</label>
                    <input type="text" className="form-control mediumFont" name="username2" placeholder="usuario o email" onChange={ handleInputChange } />
                </div>

                <div className="mb-3">
                    <label >Email</label>
                    <input type="text" className="form-control mediumFont" name="correo" placeholder="name@example.com" onChange={ handleInputChange } />
                </div>

                <label >Rol del usuario</label> <br/>
                <select name="id_perfil" placeholder="selecciona un rol" defaultValue={"default"} className="w-100 mediumFont p-3" onChange={ handleInputChange }>
                    <option value="" disabled>Selecciona un rol</option>
                    <option value="1">Administrador</option>
                    <option value="3">Asigna/Carga Material</option>
                    <option value="2">Instructor</option>
                </select>
            

            {
                (formValues.id_perfil === '5')
                
                &&

                <>
                    
                    <hr/>

                    <h1>Datos para el alta del instructor</h1>

                    <hr/>

                    <div>
                        <input type="text" className="form-control mb-3" name="nombre" placeholder="Nombre *" onChange={ handleInputChange } />
                        <input type="text" className="form-control  mb-3" name="apellido" placeholder="Apellido *" onChange={ handleInputChange } />
                        <input type="text" className="form-control  mb-3" name="telefono" placeholder="Celular" onChange={ handleInputChange } />
                        <select name="sexo" placeholder="selecciona un genero" defaultValue={"default"} className="w-100 mb-3" onChange={ handleInputChange }>
                            <option value="default" disabled>Genero</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>

                        <select name="id_curso" placeholder="selecciona un sistema *" defaultValue={"default"} className="w-100 mb-3" onChange={ handleInputChange }>
                            <option value="default" disabled>Curso *</option>
                            {
                                cursos?.map(curso => 
                                    <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                                )
                            }
                        </select>
                        <br/>

                        <input type="text" className="form-control  mb-3" name="perfil_instagram" placeholder="Perfil de Instagram" onChange={ handleInputChange } />
                        <input type="text" className="form-control  mb-3" name="perfil_fb" placeholder="Perfil de Facebook" onChange={ handleInputChange } />

                        <select
                        type="text" 
                        name="pais"
                        onChange={ handleInputChange }
                        className="w-100 mb-3"
                        placeholder="Selecciona un pais *" 
                        defaultValue={"defaultCountry"}
                        >
                            <option value="defaultCountry" disabled>Seleccione un pais *</option>
                            {
                                countries.map( country => (
                                    <option value={ country.code } key={ country.code }>{ country.name }</option>
                                ) )
                            }
                        </select>

                    </div>

                </>
            }
            
            </form>
            <button className="btn btn-danger" onClick={handleSubmit}>Confirmar</button>

        </>
    )
}
