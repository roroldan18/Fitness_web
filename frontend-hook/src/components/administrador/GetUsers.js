import React from 'react';
import { FormControl } from 'react-bootstrap';
import { useForm } from '../../hooks/useForm';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { perfil, uri } from '../../config';
import { NavLink } from 'react-router-dom';


export const GetUsers = () => {
   
    const initialState = [];
    const [usuarios, setUsuarios] = useState(initialState);


    const [formValues, handleInputChange ] = useForm({});

    
    const [searchText, setSearchText] = useState('');

    const handleSearch = (e) => {
        setSearchText(e.target.value)
    };

    //Listar con filtros
    const handleListUsers = () => {

        if( formValues.id_perfil === '' ){
            delete formValues.id_perfil; 
        }
        if( formValues.habilitado === '' ){
            delete formValues.habilitado; 
        }
        

        axios.post(`${uri}/users/withFilter`, formValues)
        .then(res => {
            const usuariosBD = res.data;
          
            if(searchText === ''){
              setUsuarios(usuariosBD.data.usuarios);
          }
          
          if(searchText !== ''){
              const usuariosFiltrados = usuariosBD.data.usuarios.filter(usuario => 
                  (usuario.instructors[0]?.nombre.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || usuario.instructors[0]?.apellido.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) || usuario.username.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ));
              
              setUsuarios(usuariosFiltrados);
          }

          
        })
    }

    const confirmarReseteoPass = (id_usuario) => {
        Swal.fire({
            title: 'Está seguro que quiere resetear la contraseña?',
            text: "No podrá revertirlo más adelante",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, resetear!'
          }).then((result) => {
            if (result.isConfirmed) {
              axios.put(`${uri}/users/reseteoPass/${id_usuario}`)
              .then(res => {

                Swal.fire(
                    'Contraseña Reseteada!',
                    'Se ha enviado un correo al usuario con la nueva contraseña.',
                    'success'
                  )
              })
            }
          })
    }


    const handleHabilitacion = (idUsuario ,debeHabilitar) => {

        if(debeHabilitar){
            Swal.fire({
                title: 'Está seguro que quiere habilitar al usuario?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Si, habilitar!`
              }).then((result) => {
                if (result.isConfirmed) {
                  axios.put(`${uri}/users/habilitar/${idUsuario}`)
                  .then(res => {
                    Swal.fire(
                        'Usuario Habilitado!',
                        'El usuario ha sido habilitado!',
                        'success'
                      )
                      handleListUsers();
                  })
                }
              }
            )
        }
        else if (!debeHabilitar){
            Swal.fire({
                title: 'Está seguro que quiere deshabilitar al usuario?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Si, deshabilitar!`
              }).then((result) => {
                if (result.isConfirmed) {
                  axios.delete(`${uri}/users/inhabilitar/${idUsuario}`)
                  .then(res => {
                    Swal.fire(
                        'Usuario Inhabilitado!',
                        'El usuario ha sido deshabilitado!',
                        'success'
                      )
                      handleListUsers();
                  })
                }
              }
            )
        }
    }



    return (
        <div>
            <hr/>
            <h2>Filtros</h2>
            <hr/>
            <select name="id_perfil" placeholder="selecciona un rol" defaultValue={"default"} className="w-25 m-3" onChange={ handleInputChange }>
                <option value="">Rol del usuario</option>
                <option value="1">Administrador</option>
                <option value="3">Asigna/Carga Material</option>
                <option value="2">Instructor</option>
            </select>
            <select name="habilitado" placeholder="Estado del usuario" defaultValue={"default"} className="w-25 m-3" onChange={ handleInputChange }>
                <option value="">Estado del usuario</option>
                <option value="1">Habilitados</option>
                <option value="0">Inhabilitados</option>
            </select>
            
            <FormControl
                    type="text" 
                    placeholder="Busca por usuario, nombre o apellido" 
                    className="mt-3 barraBusqueda" 
                    name="searchText" 
                    value={ searchText }
                    onChange={ handleSearch }
                    autoComplete="off"/>
            <button className="btn btn-danger small mt-4" onClick={handleListUsers}>Listar</button>


        <div className="table-responsive-sm">
            <table className="table-sm table">
                    <thead className="mediumFont">
                        <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th className="web">Rol</th>
                            <th className="web">E-mail</th>
                            <th>Contraseña</th>
                            <th>Condición</th>
                            <th>Habilitacion</th>
                            <th>Aceptó Terminos?</th>
                            <th></th>
                        </tr>
                    </thead>

                {
                    (usuarios !== initialState)

                    &&
                    
                    usuarios.map( user => 
                    <tbody key={user.id} className="mediumFont">
                            <tr> 
                                <td className="anchoUsuario">{user.username}</td>
                                <td>{user.instructors[0]?.nombre}</td>
                                <td>{user.instructors[0]?.apellido}</td>
                                <td className="web">{
                                perfil(user.id_perfil)
                                }</td>
                                <td className="web">{user.correo}</td>
                                <td><button onClick={() => confirmarReseteoPass(user.id)}>Resetear</button></td>
                                { (user.habilitado) ? <td>Habilitado</td> : <td>Deshabilitado</td>}
                                <td>
                                    {
                                        (user.habilitado) 
                                        ?
                                        <button 
                                        className="flex-col-center btn mediumFont btn-outline-dark btn-success bgColorRed" 
                                        value="0" 
                                        onClick={() => handleHabilitacion(user.id, false)}>Deshabilitar</button>
                                        :
                                        <button 
                                        className="flex-col-center btn mediumFont btn-outline-dark btn-success" 
                                        value="1"
                                        onClick={() => handleHabilitacion(user.id, true)}
                                        >Habilitar</button>
                                    }
                                </td>

                                { (user.acepto_terminos) ? <td>Aceptó</td> : <td>No aceptó</td>}
                                <td>
                                    <NavLink 
                                        exact 
                                        activeClassName="active" 
                                        className="navbar-brand" 
                                        to={{
                                            pathname: `/session/admin/usuarios/${user.id}`,
                                            state: {idUser: user.id}
                                            }}>
                                                <i className="fas fa-edit user-select-all fontAwesomeButton cursorPointer me-4"></i>
                                    </NavLink>
                                </td>
                            </tr>
                        </tbody>
                        ) 
                }
            </table>

        </div>


        </div>
    )
}
