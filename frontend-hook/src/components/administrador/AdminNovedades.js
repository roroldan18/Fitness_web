import React from 'react'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

import axios from 'axios';
import Swal from 'sweetalert2';
import { uri } from '../../config';

import { useForm } from '../../hooks/useForm'

export const AdminNovedades = () => {

    const [novedades, setNovedades] = useState([]);

    const [idModificaciones, setIdModificaciones] = useState('');

    const [showModificar, setShowModificar] = useState(false);

    const [formValues, handleInputChange, reset] = useForm();

    const displayInicial = {
        agregarNovedad: false,
        listarNovedades: false,
    }

    const [display, setDisplay] = useState(displayInicial)

    const handleAgregar = () => {
        reset();
        setDisplay({
            agregarNovedad:true,
            listarNovedades:false
        })
    }
    const handleListar = () => {
        reset();

        axios.get(`${uri}/novedades_instructores/`)
            .then(res => {
                setNovedades(res.data.data.novedades);
            })

        setDisplay({
            agregarNovedad:false,
            listarNovedades:true
        })
    }

    const handleSubmit = () => {

        Swal.fire({
            title: 'Está seguro que desea crear la novedad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, crear!'
          }).then((result) => {
            if (result.isConfirmed) {   
                if ( !formValues.path_imagen || !formValues.path_destino ){
                    Swal.fire({
                        title: 'Error!',
                        text: 'La imagen y la URL de destino son obligatorios',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }

                else{
                    axios.post(`${uri}/novedades_instructores/`, formValues)
                        .then(res => {
                        Swal.fire(
                            'Alta exitosa!',
                            `Se ha creado la novedad con éxito!`,
                            'success'
                        )
                        reset();
                    })
                        .catch(err => {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Ha ocurrido un error del servidor en el alta',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        })
                }
            }
        })
          
    }

    const handleHabilitacion =  (idNovedad, debeHabilitar) => {
        if(debeHabilitar){
            Swal.fire({
                title: 'Está seguro que desea habilitar la novedad?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, habilitar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${uri}/novedades_instructores/habilitar/${idNovedad}`, )
                    .then(res => {                    
                        Swal.fire(
                            'Habilitado!',
                            'El material se ha habilitado.',
                            'success'
                          )
                          handleListar();
                    })
                        .catch(err => {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Ha ocurrido un error del servidor',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        })
                    }
                })
        }

        if(!debeHabilitar){
            Swal.fire({
                title: 'Está seguro que desea deshabilitar la novedad?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, deshabilitar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${uri}/novedades_instructores/deshabilitar/${idNovedad}`)
                    .then(res => {                    
                        Swal.fire(
                            'Deshabilitado!',
                            'El material se ha deshabilitado.',
                            'success'
                          )
                          handleListar();
                        })
                        .catch(err => {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Ha ocurrido un error del servidor en el alta',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        })
                    }
                })

        }
    }

    const handleModificarNovedad = (novedadId) => {
        setIdModificaciones(novedadId);
        setShowModificar(true);
    }

    const handleModificarCancelar = () =>{
        setShowModificar(false);
        setIdModificaciones('');
        reset();
    }

    const handleModificarConfirmar = () => {

        if(!formValues.path_imagen & !formValues.path_destino & !formValues.descripcion){
            Swal.fire({
                title: 'Error!',
                text: 'Debe enviar algun dato para modificar',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            axios.put(`${uri}/novedades_instructores/${idModificaciones}`, formValues)
                        .then(res => {                    
                            Swal.fire(
                                'Confirmado!',
                                'El curso se ha modificado.',
                                'success'
                              )
                              setShowModificar(false);
                              handleListar();
                              setIdModificaciones('');
                              reset();
                        })
                            .catch(err => {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Ha ocurrido un error del servidor en la modificacion',
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                })
                                setShowModificar(false);
                                setIdModificaciones('');
                                reset();
                            })
        }

    }

    const handleEliminar = (idNovedad) => {
        Swal.fire({
            title: 'Está seguro que desea eliminar la novedad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${uri}/novedades_instructores/${idNovedad}`, )
                .then(res => {                    
                    Swal.fire(
                        'Eliminado!',
                        'El material se ha eliminado.',
                        'success'
                      )
                      handleListar();
                })
                    .catch(err => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Ha ocurrido un error del servidor',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })
                    })
                }
            })
    }



    return (
    <>  
        <div className="mt-5">
            <h1>Novedades</h1>
            <hr />
        </div>

        <div className="btn-group m-3" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-close-white btn-outline-danger btn-lg "  onClick={handleAgregar}>Agregar Novedad</button>
            <button type="button" className="btn btn-close-white btn-outline-danger btn-lg " onClick={handleListar}>Listar Novedades</button>
        </div>

        {
            (display.agregarNovedad)

            &&

            <div>
                <form onSubmit={ handleSubmit } className="form-check mediumFont">
                    <label >Datos para agregar una novedad</label>
                    <div className="mb-3">
                        <input type="text" className="form-control mediumFont" name="path_imagen" placeholder="URL de imagen - DROPBOX" onChange={ handleInputChange } />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control mediumFont" name="path_destino" placeholder="Link del destino (instagram, facebook, etc.)" onChange={ handleInputChange } />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control mediumFont" name="descripcion" placeholder="Descripcion de la novedad" onChange={ handleInputChange } />
                    </div>
                </form>
                <button className="btn btn-danger" onClick={handleSubmit}>Confirmar</button>
            </div>
        }
        {
            (display.listarNovedades)
            &&
            <div className="mb-3">
                <table id="tableMixes" className="table">
                        <thead>
                            <tr>
                                <th id="colNombre" className="pathStyle cursorPointer">Imagen</th>
                                <th id="colEstado" className="pathStyle cursorPointer">URL Destino</th>
                                <th>Descripcion</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    novedades?.map(novedad =>
                                        <tr key={novedad.id}> 
                                            <td className="pathStyle">{novedad.path_imagen}</td>
                                            <td className="pathStyle">{novedad.path_destino}</td>
                                            <td>{novedad.descripcion}</td>
                                            <td>{(novedad.habilitado) ? "Habilitado" : "Deshabilitado"} {(novedad.habilitado) ? <button className="btn btn-dark btn-outline-light m-2" onClick={() => handleHabilitacion(novedad.id, false)}>Deshabilitar</button> : <button className="btn btn-dark m-2" onClick={() => handleHabilitacion(novedad.id, true)}>Habilitar</button> }</td>
                                            
                                            <td>
                                                <i className="fas fa-edit user-select-all fontAwesomeButton cursorPointer me-4" onClick={() => handleModificarNovedad(novedad.id)}></i>
                                                <button className="btn btn-dark m-2" onClick={() => handleEliminar(novedad.id)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    )
                                }
                        </tbody>
                    </table>

                    <Modal show={showModificar} onHide={() => setShowModificar(false)}>
                        <Modal.Header className="text-dark">
                            <h1>Modificaciones</h1>
                            <h6>*Complete solo lo que desea modificar</h6>
                        </Modal.Header>
                        <Modal.Body>
                            <form action="" className="flex-column">
                                <input type="text" className="form-control mediumFont" name="path_imagen" placeholder="URL de imagen - DROPBOX" onChange={ handleInputChange } />
                                <input type="text" className="form-control mediumFont" name="path_destino" placeholder="Link del destino (instagram, facebook, etc.)" onChange={ handleInputChange } />
                                <input type="text" className="form-control mediumFont" name="descripcion" placeholder="Descripcion de la novedad" onChange={ handleInputChange } />
                            </form> 
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModificarCancelar}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleModificarConfirmar}>
                                Grabar Modificaciones
                            </Button>
                        </Modal.Footer>
                    </Modal>

            </div>
        }

    </>

    )
}
