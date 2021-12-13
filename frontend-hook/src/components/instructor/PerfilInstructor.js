import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import { provincias } from '../../database/provincias';
import { localidades } from '../../database/localidades';
import { titleCase } from '../../funciones/titleCase';
import { countries } from '../../database/countries';
import axios from 'axios';
import { uri } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { startChecking } from '../../actions/auth';

export const PerfilInstructor =  () => {
    const { idUsuario ,usuario, correo } = useSelector(state => state.auth);
    const {id, nombre, apellido, direccion, telefono, perfil_fb, perfil_instagram, provincia, ciudad} = useSelector(state => state.idInstructor);
    const [ valueForm, handleInputChange, reset ] = useForm();

    const dispatch = useDispatch();


    //MODIFICACION NOMBRE
    const [ showCardNombre, setShowCardNombre ] = useState(false);
    const handleModifNombre = () => {
        setShowCardNombre(!showCardNombre);
    }
    const handleCancelNombre = () => {
        setShowCardNombre(!showCardNombre);
        reset();
    }
    const handleConfirmNombre = (e) => {
        e.preventDefault();
        
        if ( (valueForm.nombre === null || valueForm.nombre === undefined || valueForm.nombre?.trim() === '') && (valueForm.apellido === null || valueForm.apellido === undefined || valueForm.apellido?.trim() === ''))
        {
            Swal.fire({
                title: 'Error!',
                text: 'Debe ingresar algún dato para modificar',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            let datosModificar = {};

            if(valueForm.nombre?.trim() === ''){
                datosModificar={
                    apellido: valueForm.apellido
                }
            }

            else if(valueForm.apellido?.trim() === ''){
                datosModificar={
                    nombre: valueForm.nombre
                }
            }
            else{
                datosModificar={
                    nombre: valueForm.nombre,
                    apellido: valueForm.apellido
                }
            }
            axios.put(`${uri}/instructores/${id}`, datosModificar)
                .then(res=> {
                    Swal.fire(
                        'Modificacion exitosa!',
                        `Tu nombre se ha modificado con exito.`,
                        'success'
                      )
                    dispatch( startChecking() );
                    reset();
                })
                .catch(error => console.log('Error al efectuar la modificacion'));
            
            setShowCardNombre(!showCardNombre);
        }
    }

    //MODIFICAR EMAIL

    const [ showCardCorreo, setShowCardCorreo ] = useState(false);
    const handleModifCorreo = () => {
        setShowCardCorreo(!showCardCorreo);
    }
    const handleCancelCorreo = () => {
        setShowCardCorreo(!showCardCorreo);
        reset();
    }
    const handleConfirmCorreo = (e) => {
        e.preventDefault();
        const correoNuevo = {
            correo: valueForm.correo
        }
        const regexEmail = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        const coincidencia = valueForm.correo.match(regexEmail);

        if ( valueForm.correo === null || valueForm.correo === undefined || valueForm.correo.trim() === '' || coincidencia?.length < 1 || !coincidencia)
        {
            Swal.fire({
                title: 'Error!',
                text: 'Debe ingresar algún dato válido',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else{
            axios.put(`${uri}/users/${idUsuario}`, correoNuevo)
                .then(res=> {
                    Swal.fire(
                        'Modificacion exitosa!',
                        `El correo ha sido modificado con exito.`,
                        'success'
                      )
                    dispatch( startChecking() );
                    reset();
                })
                .catch(error => console.log('Error al efectuar la modificacion'));
            
            setShowCardCorreo(!showCardCorreo);
        }
    }

    //MODIFICACION CELULAR
    const [ showCardCellphone, setShowCardCellphone ] = useState(false);
    const handleModifCellphone = () => {
        setShowCardCellphone(!showCardCellphone);
    }
    const handleCancelCellphone = () => {
        setShowCardCellphone(!showCardCellphone);
        reset();
    }
    const handleConfirmCellphone = async (e) => {
        e.preventDefault();
        const reg = new RegExp('^[0-9]+$');        
        const result = valueForm.cellphone.match(reg); 
        const celularNuevo = {
            telefono: valueForm.cellphone
        }

        if( !isNaN(parseInt(valueForm.cellphone)) && valueForm.cellphone.length <= 15 && result !== null ) {
            axios.put(`${uri}/instructores/${id}`, celularNuevo)
                .then(res=> {
                    Swal.fire(
                        'Modificacion exitosa!',
                        `El celular ha sido modificado con exito.`,
                        'success'
                      )
                    dispatch( startChecking() );
                    reset();
                })
                .catch(error => console.log('Error al efectuar la modificacion'))
            setShowCardCellphone(!showCardCellphone);
        }
        else{
            Swal.fire({
                title: 'Error!',
                text: 'Debe completar solo números y la longitud debe ser menor a 15 numeros',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
    }

    //MODIFICACION INSTAGRAM
    const [ showCardInstagram, setShowCardInstagram ] = useState(false);
    const handleModifInstagram = () => {
        setShowCardInstagram(!showCardInstagram);
    }
    const handleCancelInstagram = () => {
        setShowCardInstagram(!showCardInstagram);
        reset();
    }
    const handleConfirmInstagram = (e) => {
        e.preventDefault();
        const instagramNuevo = {
            perfil_instagram: valueForm.instagram
        }

        if ( valueForm.instagram === null || valueForm.instagram === undefined || valueForm.instagram.trim() === '' )
        {
            Swal.fire({
                title: 'Error!',
                text: 'Debe ingresar algún dato válido',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else if (valueForm.instagram.startsWith('@')){
            Swal.fire({
                title: 'Error!',
                text: 'No se debe incluir el símbolo @',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            axios.put(`${uri}/instructores/${id}`, instagramNuevo)
                .then(res=> {
                    Swal.fire(
                        'Modificacion exitosa!',
                        `El instagram ha sido modificado con exito.`,
                        'success'
                      )
                    dispatch( startChecking() );
                    reset();
                })
                .catch(error => console.log('Error al efectuar la modificacion'));
            setShowCardInstagram(!showCardInstagram);
        }

    }

    //MODIFICAR FACEBOOK
    const [ showCardFacebook, setShowCardFacebook ] = useState(false);
    const handleModifFacebook = () => {
        setShowCardFacebook(!showCardFacebook);
    }
    const handleCancelFacebook = () => {
        setShowCardFacebook(!showCardFacebook);
        reset();
    }
    const handleConfirmFacebook = (e) => {
        e.preventDefault();
        const perfilFbNuevo = {
            perfil_fb: valueForm.facebook
        }

        if ( valueForm.facebook === null || valueForm.facebook === undefined || valueForm.facebook.trim() === '' )
        {
            Swal.fire({
                title: 'Error!',
                text: 'Debe ingresar algún dato válido',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            axios.put(`${uri}/instructores/${id}`, perfilFbNuevo)
                .then(res=> {
                    Swal.fire(
                        'Modificacion exitosa!',
                        `El facebook ha sido modificado con exito.`,
                        'success'
                      )
                    dispatch( startChecking() );
                    reset();
                })
                .catch(error => console.log('Error al efectuar la modificacion'));
            
            setShowCardFacebook(!showCardFacebook);
        }
    }


    //MODIFICAR DIRECCION
    const [ showCardAddress, setShowCardAddress ] = useState(false);
    const handleModifAddress = () => {
        setShowCardAddress(!showCardAddress);
    }
    const handleCancelAddress = () => {
        setShowCardAddress(!showCardAddress);
        reset();
    }
    const actualProvinceId = valueForm.provincia;
    const localidadesSort = localidades.sort((a,b) => (a.nombre > b.nombre) ? 1 : -1)
    const localidadesFiltradas = localidadesSort.filter( localidad => localidad.provincia.id === actualProvinceId )
    const handleConfirmAddress = async(e) => {
        e.preventDefault();       

        if(!valueForm.pais){
            Swal.fire({
                title: 'Error!',
                text: 'Debe seleccionar un pais',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        
        else{
            const countrySelected = countries.find(country => country.code === valueForm.pais);
            
            if(valueForm.pais === 'AR'){
                if ( valueForm.direccion === null || valueForm.direccion === undefined || valueForm.direccion.trim() === '' || valueForm.ciudad === null || valueForm.ciudad === undefined || valueForm.ciudad.trim() === '' || valueForm.provincia === null || valueForm.provincia === undefined || valueForm.provincia.trim() === '' || valueForm.pais === undefined || valueForm.pais === null || valueForm.pais.trim() === '' ){
                    Swal.fire({
                        title: 'Error!',
                        text: 'Debe completar todos los datos',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      })
                }
                else {
                    const provinciaSeleccionada = provincias.find(provincia => provincia.id === valueForm.provincia);
                    const localidadSeleccionada = localidades.find(localidad => localidad.id === valueForm.ciudad);  

                    if( !provinciaSeleccionada || !localidadSeleccionada ){
                        Swal.fire({
                            title: 'Error!',
                            text: 'Debe seleccionar un a provincia y ciudad del listado',
                            icon: 'error',
                            confirmButtonText: 'OK'
                          })
                    }
                    else{
                        const nuevoDomicilioArgentino = {
                            direccion: titleCase(valueForm.direccion),
                            pais: titleCase(countrySelected.name),
                            provincia: titleCase(provinciaSeleccionada.nombre),
                            ciudad: titleCase(localidadSeleccionada.nombre)
                        }
    
                        axios.put(`${uri}/instructores/${id}`, nuevoDomicilioArgentino)
                        .then(res=> {
                            Swal.fire(
                                'Modificacion exitosa!',
                                `El domicilio ha sido modificado con exito.`,
                                'success'
                                )
                            dispatch( startChecking() );
                            reset();
                        })
                        .catch(error => console.log('Error al efectuar la modificacion'));
                        setShowCardAddress(!showCardAddress);
                    }           

                    }
    
            } 
            else if (valueForm.pais !== 'AR'){
                if ( valueForm.direccion === null || valueForm.direccion === undefined || valueForm.direccion.trim() === '' || valueForm.ciudad === null || valueForm.ciudad === undefined || valueForm.ciudad.trim() === '' || valueForm.provincia === null || valueForm.provincia === undefined || valueForm.provincia.trim() === '' || valueForm.pais === undefined || valueForm.pais === null || valueForm.pais.trim() === '' ) {
    
                    Swal.fire({
                        title: 'Error!',
                        text: 'Debe completar todos los datos',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      })
                }
                else{
                    const nuevoDomicilioExtranjero = {
                        direccion: titleCase(valueForm.direccion),
                        pais: titleCase(countrySelected.name),
                        provincia: titleCase(valueForm.ciudad),
                        ciudad: titleCase(valueForm.provincia)
                    }

                    axios.put(`${uri}/instructores/${id}`, nuevoDomicilioExtranjero)
                    .then(res=> {
                        Swal.fire(
                            'Modificacion exitosa!',
                            `El domicilio ha sido modificado con exito.`,
                            'success'
                          )
                        dispatch( startChecking() );
                        reset();
                    })
                    .catch(error => console.log('Error al efectuar la modificacion'));
                    setShowCardAddress(!showCardAddress);
                }
            }
        }

        
    }

    return (
    <>
        <h1 className="mt-3">Mis Datos</h1>
        <hr />

        <div>
            <Card body className="cardPerfil  m-4">
                <span>
                    Nombre y Apellido
                </span>
                <span className="displayRow">
                    <span className="spanInfo">{nombre} {apellido}</span>
                    <i className="fas fa-angle-right flex-col-center cursorPointer" onClick={ handleModifNombre }></i>
                    {
                        showCardNombre 
                        &&
                        <>
                        <div className='bg-overlay' onClick={ handleModifNombre }></div>
                        <Card className="cardFloating">
                        <form className="formCard">
                            <label>Modificar Nombre</label>
                            <input 
                            type="text" 
                            placeholder='Ingresa tu nombre'
                            name="nombre"
                            onChange={ handleInputChange }
                            />
                            <label>Modificar Apellido</label>
                            <input 
                            type="text" 
                            placeholder='Ingresa tu apellido'
                            name="apellido"
                            onChange={ handleInputChange }
                            />
                            <div>
                                <button className="btn btn-dark" onClick={ handleConfirmNombre }>Confirmar</button>
                                <button className="btn btn-dark" onClick={ handleCancelNombre }>Cancelar</button>
                            </div>
                        </form>
                        </Card>
                        </>
                    }
                </span>
            </Card>

            <Card body className="cardPerfil m-4">
                <span>
                    Usuario
                </span>
                <span className="displayRow">
                    <span className="spanInfo">{usuario}</span>
                </span>
            </Card>

            <Card body className="cardPerfil m-4">
                <span>
                    Email
                </span>
                <span className="displayRow">
                    <span className="spanInfo">{correo}</span>
                    <i className="fas fa-angle-right flex-col-center cursorPointer" onClick={ handleModifCorreo }></i>
                    {
                        showCardCorreo 
                        &&
                        <>
                        <div className='bg-overlay' onClick={ handleModifCorreo }></div>
                        <Card className="cardFloating">
                        <form className="formCard">
                            <label>Modificar Email</label>
                            <input 
                            type="email" 
                            placeholder='Ingresa tu nuevo correo'
                            name="correo"
                            onChange={ handleInputChange }
                            />
                            <div>
                                <button className="btn btn-dark" onClick={ handleConfirmCorreo }>Confirmar</button>
                                <button className="btn btn-dark" onClick={ handleCancelCorreo }>Cancelar</button>
                            </div>
                        </form>
                        </Card>
                        </>
                    }
                </span>
            </Card>

            <Card body className="cardPerfil m-4">
                <span>
                    Celular
                </span>
                <span className="displayRow">
                    <span className="spanInfo">{telefono}</span>
                    <i className="fas fa-angle-right flex-col-center cursorPointer" onClick={ handleModifCellphone }></i>
                    {
                        showCardCellphone 
                        &&
                        <>
                        <div className='bg-overlay' onClick={ handleModifCellphone }></div>
                        <Card className="cardFloating">
                        <form className="formCard">
                            <label>Modificar Celular</label>
                            <input 
                            type="text" 
                            placeholder='Ingresa tu nuevo número'
                            name="cellphone"
                            onChange={ handleInputChange }
                            />
                            <div>
                                <button className="btn btn-dark" onClick={ handleConfirmCellphone }>Confirmar</button>
                                <button className="btn btn-dark" onClick={ handleCancelCellphone }>Cancelar</button>
                            </div>
                        </form>
                        </Card>
                        </>
                    }
                </span>
            </Card>

            <Card body className="cardPerfil m-4">
                <span>
                    Instagram
                </span>
                <span className="displayRow">
                    <span className="spanInfo">@{perfil_instagram}</span>
                    <i className="fas fa-angle-right flex-col-center cursorPointer" onClick={ handleModifInstagram }></i>

                    {
                        showCardInstagram
                        &&
                        <>
                            <div className='bg-overlay' onClick={ handleModifInstagram }></div>
                            <Card className="cardFloating">
                                <form className="formCard">
                                    <label>Modificar Instagram</label>
                                    <span className="displayRow center">
                                        <h4 className="flex-col-center">@</h4>
                                        <input 
                                        type="text" 
                                        placeholder='Ingresa tu Instagram'
                                        name="instagram"
                                        onChange={ handleInputChange }
                                        />
                                    </span>
                                    <div>
                                        <button className="btn btn-dark" onClick={ handleConfirmInstagram }>Confirmar</button>
                                        <button className="btn btn-dark" onClick={ handleCancelInstagram }>Cancelar</button>
                                    </div>
                                </form>
                            </Card>
                        </>
                    }
                </span>
            </Card>

            <Card body className="cardPerfil m-4">
                <span>
                    Perfil de Facebook
                </span>
                <span className="displayRow">
                    <span className="spanInfo">{perfil_fb}</span>
                    <i className="fas fa-angle-right flex-col-center cursorPointer" onClick={ handleModifFacebook }></i>

                    {
                        showCardFacebook
                        &&
                        <>
                            <div className='bg-overlay' onClick={ handleModifFacebook }></div>
                            <Card className="cardFloating">
                                <form className="formCard">
                                    <label>Modificar perfil de Facebook</label>
                                    <span className="displayRow center">
                                        <input 
                                        type="text" 
                                        placeholder='Ingresa tu Facebook'
                                        name="facebook"
                                        onChange={ handleInputChange }
                                        />
                                    </span>
                                    <div>
                                        <button className="btn btn-dark" onClick={ handleConfirmFacebook }>Confirmar</button>
                                        <button className="btn btn-dark" onClick={ handleCancelFacebook }>Cancelar</button>
                                    </div>
                                </form>
                            </Card>
                        </>
                    }
                </span>
            </Card>

            <Card body className="cardPerfil m-4">
                <span className="me-5">
                    Direccion
                </span>
                <span className="displayRow">
                    {
                        valueForm.pais === 'AR'
                        ?
                        <span className="spanInfo">{direccion} - {provincia} - {ciudad}</span>
                        :
                        <span className="spanInfo">{direccion} - {provincia} - {ciudad}</span>
                    }
                    <i className="fas fa-angle-right flex-col-center cursorPointer" onClick={ handleModifAddress }></i>
                    {
                        showCardAddress
                        &&
                        <>
                            <div className='bg-overlay' onClick={ handleModifAddress }></div>
                            <Card className="cardFloating">
                                <form className="formCard">
                                    <label>Ingrese la Direccion</label>
                                    <input 
                                    type="text" 
                                    placeholder='Ingrese la dirección'
                                    name="direccion"
                                    onChange={ handleInputChange }/>

                                    <label>Pais</label>
                                        <select
                                        type="text" 
                                        name="pais"
                                        onChange={ handleInputChange }
                                        placeholder="Seleccione un pais" 
                                        defaultValue={"defaultCountry"}
                                        >
                                            <option value="defaultCountry" disabled>Seleccione un pais</option>
                                            {
                                                countries.map( country => (
                                                    <option value={ country.code } key={ country.code }>{ country.name }</option>
                                                ) )
                                            }
                                        </select>

                                    {
                                        valueForm.pais === 'AR'
                                        ?
                                    <>
                                        <label>Provincia</label>
                                        <select
                                        type="text" 
                                        name="provincia"
                                        onChange={ handleInputChange }
                                        placeholder="Seleccione una provincia" 
                                        defaultValue={"defaultProvincia"}
                                        >
                                            <option value="defaultProvincia" disabled>Seleccione una provincia</option>
                                            {
                                                provincias.map( provincia => (
                                                    <option value={ provincia.id } key={ provincia.id }>{ provincia.nombre }</option>
                                                ) )
                                            }
                                        </select>


                                        <label>Ciudad</label>
                                        <select
                                        type="text" 
                                        name="ciudad"
                                        onChange={ handleInputChange }
                                        placeholder="Seleccione una ciudad" 
                                        defaultValue={"defaultCiudad"}
                                        >
                                            <option value="defaultCiudad" disabled>Seleccione una ciudad</option>
                                        {
                                            localidadesFiltradas.map( localidad => (
                                                <option value={ localidad.id } key={ localidad.id }>{ localidad.nombre }</option>
                                            ))
                                        }
                                        
                                        </select>
                                    </> 

                                    :
                                    
                                    <>
                                        <label>Provincia/Estado</label>
                                        <input
                                        type="text" 
                                        name="provincia"
                                        onChange={ handleInputChange }
                                        placeholder="Ingrese una provincia/estado" 
                                        />

                                        <label>Ciudad</label>
                                        <input 
                                        type="text" 
                                        name="ciudad"
                                        onChange={ handleInputChange }
                                        placeholder="Ingrese una ciudad" 
                                        />
                                    </>
                                    }

                                    <div>
                                        <button className="btn btn-dark" onClick={ handleConfirmAddress }>Confirmar</button>
                                        <button className="btn btn-dark" onClick={ handleCancelAddress }>Cancelar</button>
                                    </div>
                                </form>
                            </Card>
                        </>
                    }
                </span>
            </Card>
                
        </div> 
    </>
    )
}

