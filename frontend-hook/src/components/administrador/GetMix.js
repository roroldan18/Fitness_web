import axios from 'axios';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import { sortTable2 } from '../../funciones/sortTable2';
import { NavLink } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { uri } from '../../config';

export const GetMix = () => {

    const [cursos, setCursos] = useState([]);

    const [showModificar, setShowModificar] = useState(false);
    
    const [formValues, handleInputChange, reset] = useForm();

    const [display, setDisplay] = useState({
        agregarSistema: false,
        listarSistemas: false,
    })

    const materialInitial = [];
    const [materiales, setMaterial] = useState(materialInitial);
    
    const handleMateriales = (e) => {

        axios.get(`${uri}/materiales/admin/curso/${e}`).then(res => {
            const listaMateriales = res.data.data.material;
            setMaterial(listaMateriales);
        })
    }

    const handleAgregar = () => {
        axios.get(`${uri}/cursos/`)
        .then(res => {
            const cursos = res.data.data.cursos;
            setCursos(cursos)
        });

        setMaterial(materialInitial);

        setDisplay({
            agregarSistema: true,
            listarSistemas: false    
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
            listarSistemas: true    
        })
    }

    const handleSubmit = () => {
        if ( !formValues.descripcion || !formValues.id_curso ){
            Swal.fire({
                title: 'Error!',
                text: 'El nombre del mix y el programa son obligatorios',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else{
            axios.post(`${uri}/materiales/`, formValues)
                .then(res => {
                const material = res.data.descripcion;
                
                Swal.fire(
                    'Alta exitosa!',
                    `Se ha creado el ${material} con éxito!`,
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

    const handleHabilitacion = (idMaterial, debeHabilitar) => {
        if(debeHabilitar){
            Swal.fire({
                title: 'Está seguro que desea habilitar el material?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, habilitar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`${uri}/materiales/habilitar/${idMaterial}`, )
                    .then(res => {                    
                        Swal.fire(
                            'Habilitado!',
                            'El material se ha habilitado.',
                            'success'
                          )
                          handleMateriales(res.data.id_curso);
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
                title: 'Está seguro que desea deshabilitar el material?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, deshabilitar!'
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`${uri}/materiales/${idMaterial}`)
                    .then(res => {                    
                        Swal.fire(
                            'Deshabilitado!',
                            'El material se ha deshabilitado.',
                            'success'
                          )
                          handleMateriales(res.data.material.id_curso);
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

    const handleModificarMix = (materialId) => {
            setIdModificaciones(materialId);
            setShowModificar(true);
    }

    const handleModificarConfirmar = () => {
        if(!formValues.descripcion & !formValues.id_curso ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe enviar algun dato para modificar',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            const getIDCurso = async () =>{
                axios.get(`${uri}/materiales/${idModificaciones}`)
                    .then(response =>{
                    handleMateriales(response.data.data.material.id_curso);
                  })
             }
            
            

            axios.put(`${uri}/materiales/${idModificaciones}`, formValues)
                        .then(res => {                    
                            Swal.fire(
                                'Confirmado!',
                                'El curso se ha modificado.',
                                'success'
                              )
                              setShowModificar(false);
                              getIDCurso();
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

    const handleModificarCancelar = () => {
        setShowModificar(false);
        setIdModificaciones('');
        reset();
    }


    return (
        <div>
            <div className="btn-group m-3" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-close-white btn-outline-danger btn-lg"  onClick={handleAgregar}>Agregar Mix</button>
                <button type="button" className="btn btn-close-white btn-outline-danger btn-lg" onClick={handleListar}>Listar Mixes</button>
            </div>

            {
                (display.agregarSistema)
                &&
                <div>
                    <form onSubmit={ handleSubmit } className="form-check mediumFont">
                        <label>Datos para agregar un mix</label>
                        <div className="mb-3">
                            <input type="text" className="form-control mediumFont" name="descripcion" placeholder="Nombre del mix" onChange={ handleInputChange } />
                        </div>
                        <div className="mb-3">
                            <select name="id_curso" defaultValue="default" onChange={handleInputChange}>
                                <option value="default" disabled>Programa al que pertenece</option>
                                {
                                    cursos?.map(curso => 
                                        <option key={curso.id} value={curso.id} >{curso.nombre}</option>
                                        )
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control mediumFont" name="imagen_path" placeholder="Ruta de la imagen (opcional)" onChange={ handleInputChange } />
                        </div>
                    </form>
                    <button className="btn btn-danger" onClick={handleSubmit}>Confirmar</button>
                </div>
            }

            {
                (display.listarSistemas)
                &&
                <div className="mb-3">
                    <select name="id_curso" defaultValue="default" onChange={(e) =>handleMateriales(e.target.value)}>
                        <option value="default" disabled>Selecciona el programa</option>
                        {
                            cursos?.map(curso => 
                                <option key={curso.id} value={curso.id} >{curso.nombre}</option>
                                )
                        }
                    </select>
                </div>
            }

            {
                (materiales.length>0)
                &&
                <div>
                    <h2 className="mt-4 mb-4">Listado de Mixes</h2>
                    <table id="tableMixes" className="table">
                        <thead>
                            <tr>
                                <td id="colNombre" onClick={() => sortTable2(0) } className="w-25 cursorPointer">Nombre</td>
                                <td id="colEstado" onClick={() => sortTable2(1) } className="w-25 cursorPointer">Estado</td>
                                <td>Sistema</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    materiales?.map(material =>
                                        <tr key={material.id}> 
                                            <td>{material.descripcion}</td>
                                            <td className="web">{(material.activo) ? "Habilitado" : "Deshabilitado"} {(material.activo) ? <button className="btn btn-dark btn-outline-light m-2" onClick={() => handleHabilitacion(material.id, false)}>Deshabilitar</button> : <button className="btn btn-dark m-2" onClick={() => handleHabilitacion(material.id, true)}>Habilitar</button> }</td>
                                            <td className="responsive">{(material.activo) ? "Habilitado" : "Deshabilitado"} {(material.activo) ? <button className="btn" onClick={() => handleHabilitacion(material.id, false)}><i className="fas fa-ban"></i></button> : <button className="btn" onClick={() => handleHabilitacion(material.id, true)}><i className="far fa-check-circle"></i></button> }</td>
                                            <td>{material.curso.nombre}</td>
                                            <td>
                                                <i className="fas fa-edit user-select-all fontAwesomeButton cursorPointer me-4" onClick={() => handleModificarMix(material.id)}></i>

                                                <NavLink 
                                                    exact 
                                                    activeClassName="active" 
                                                    className="navbar-brand" 
                                                    to={{
                                                        pathname: `/session/admin/materiales/${material.id}`,
                                                        state: {materialId: material.id}
                                                        }}>
                                                            <button className="btn btn-dark btn-outline-light m-2">Ingresar</button>
                                                </NavLink>
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
                                <input type="text" className="form-control m-2" name="descripcion" placeholder="Nombre del mix" onChange={ handleInputChange }/>
                                <select name="id_curso" defaultValue="" onChange={handleInputChange} className="m-2">
                                <option value="">Cambiar el programa del mix</option>
                                {
                                    cursos?.map(curso => 
                                        <option key={curso.id} value={curso.id} >{curso.nombre}</option>
                                        )
                                }
                            </select>
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

            {
                
            }    

        </div>
    )
}
