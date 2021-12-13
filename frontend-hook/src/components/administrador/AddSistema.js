import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import axios from 'axios';
import Swal from 'sweetalert2';
import { uri } from '../../config';

import { useForm } from '../../hooks/useForm';


export const AddSistema = () => {

    const [cursos, setCursos] = useState([]);
    const [showModificar, setShowModificar] = useState(false);

    const [display, setDisplay] = useState({
        agregarSistema: false,
        mostrarSistema: false,
    })

    const [formValues, handleInputChange, reset] = useForm();

    const handleSubmit = () => {
        if ( !formValues.nombre ){
            Swal.fire({
                title: 'Error!',
                text: 'El nombre del sistema es obligatorio',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else{
            axios.post(`${uri}/cursos/`, formValues)
                .then(res => {
                const sistema = res.data.nombre;
                
                Swal.fire(
                    'Alta exitosa!',
                    `Se ha creado el sistema ${sistema} con éxito!`,
                    'success'
                  )
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

    const handleAgregar = () => {
        setDisplay({
            agregarSistema: true,
            mostrarSistema: false
        })
    }

    const handleListar = () => {
        axios.get(`${uri}/cursos/`)
            .then(res => {
                const cursos = res.data.data.cursos;
                setCursos(cursos)
    });

        setDisplay({
            agregarSistema: false,
            mostrarSistema: true    
        })
    }

    const handleHabilitacion = (idCurso, debeHabilitar) => {
        
        if(debeHabilitar){
            Swal.fire({
                title: 'Está seguro que desea habilitar el curso?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, habilitar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${uri}/cursos/habilitar/${idCurso}`, )
                    .then(res => {                    
                        Swal.fire(
                            'Habilitado!',
                            'El curso se ha habilitado.',
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

        if(!debeHabilitar){
            Swal.fire({
                title: 'Está seguro que desea deshabilitar el curso?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, deshabilitar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`${uri}/cursos/${idCurso}`)
                    .then(res => {                    
                        Swal.fire(
                            'Deshabilitado!',
                            'El curso se ha deshabilitado.',
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


    const [idModificaciones, setIdModificaciones] = useState('');
    
    const handleModificar = (e) => {
        e.preventDefault();
        setIdModificaciones(e.target.value);
        setShowModificar(true);
    }

    const handleModificarConfirmar = () => {

        if(!formValues.nombre & !formValues.sigla & !formValues.descripcion ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe enviar algun dato para cambiar',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            axios.put(`${uri}/cursos/${idModificaciones}`, formValues)
                        .then(res => {                    
                            Swal.fire(
                                'Confirmado!',
                                'El curso se ha modificado.',
                                'success'
                              )
                              setShowModificar(false);
                              setIdModificaciones('');
                              handleListar();
                              reset();
                        })
                            .catch(err => {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Ha ocurrido un error del servidor en el alta',
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                })
                                setShowModificar(false);
                                setIdModificaciones('');
                                reset();
                            })
        }

    }
    
    const handleModificarCancelar = () => {
        setShowModificar(false);
        setIdModificaciones('');
        reset();
    }
    

    return (
        <>
            <div className="mt-5">
                <h1>Programas</h1>
                <hr />
            </div>
            <div className="btn-group m-3" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-close-white btn-outline-danger btn-lg"  onClick={handleAgregar}>Nuevo Programa</button>
                <button type="button" className="btn btn-close-white btn-outline-danger btn-lg" onClick={handleListar}>Listar Programas</button>
            </div>

            <div>

            </div>
            {
                (display.mostrarSistema)
                &&
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Sigla</th>
                            <th>Descripcion</th>
                            <th>Estado</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                            {cursos?.map(curso =>
                                <tr key={curso.id}>
                                    <td>{curso.nombre}</td>
                                    <td>{curso.sigla}</td>
                                    <td>{curso.descripcion}</td>
                                    <td>{(curso.activo) ? "Habilitado" : "Deshabilitado"}</td>
                                    <td>
                                        <button value={curso.id} type="button" className="btn btn-light btn-outline-danger mediumFont web" onClick={handleModificar}>Modificar</button>
                                        <button value={curso.id} type="button" className="btn responsive" onClick={handleModificar}><i className="fas fa-edit"></i></button>

                                        {
                                        (curso.activo) 
                                        ? 
                                        <>
                                        <button type="button" className="btn btn-light btn-outline-danger mediumFont web" onClick={() => handleHabilitacion(curso.id, false)}>Deshabilitar</button>
                                        <button type="button" className="btn  responsive" onClick={() => handleHabilitacion(curso.id, false)}><i className="fas fa-ban"></i></button>
                                        </>
                                        :
                                        <>
                                        <button type="button" className="btn btn-light btn-outline-danger mediumFont web" onClick={() => handleHabilitacion(curso.id, true)}>Habilitar</button>
                                        <button type="button" className="btn responsive" onClick={() => handleHabilitacion(curso.id , true)}><i className="far fa-check-circle"></i></button>
                                        </>
                                        }
                                    </td>
                                </tr>
                                
                            )}
                    </tbody>
                </table>
            }
                <Modal show={showModificar} onHide={() => setShowModificar(false)}>
                <Modal.Header className="text-dark">
                    <h1>Modificaciones</h1>
                </Modal.Header>
                    
                    <form action="">
                        <input type="text" className="form-control mb-3" name="nombre" placeholder="Nombre" onChange={ handleInputChange } />
                        <input type="text" className="form-control  mb-3" name="sigla" placeholder="Sigla" onChange={ handleInputChange } />
                        <input type="text" className="form-control  mb-3" name="descripcion" placeholder="Descripcion" onChange={ handleInputChange } />
                    </form>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModificarCancelar}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={handleModificarConfirmar}>
                            Grabar modificaciones
                        </Button>
                    </Modal.Footer>
                </Modal>
            {
                (display.agregarSistema)

                &&
                <div>
                    <form onSubmit={ handleSubmit } className="form-check mediumFont">
                        <div className="mb-3">
                            <label>Nombre</label>
                            <input type="text" className="form-control mediumFont" name="nombre" placeholder="nombre del sistema" onChange={ handleInputChange } />
                        </div>
                        <div className="mb-3">
                            <label>Sigla</label>
                            <input type="text" className="form-control mediumFont" name="sigla" placeholder="sigla del sistema" onChange={ handleInputChange } />
                        </div>
                        <div className="mb-3">
                            <label>Descripcion</label>
                            <input type="text" className="form-control mediumFont" name="descripcion" placeholder="descripcion del sistema" onChange={ handleInputChange } />
                        </div>
                    </form>
                    <button className="btn btn-danger" onClick={handleSubmit}>Confirmar</button>
                </div>
            }
        </>
    )
}
