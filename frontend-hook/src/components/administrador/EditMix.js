import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import { sortTable3 } from '../../funciones/sortTable3';
import { uri } from '../../config';
import { NavLink, useHistory } from 'react-router-dom';

export const EditMix = (materialId) => {

    const history = useHistory();
    const initialDisplay = {
        agregarTrack: false,
        agregarCarpeta: false,
        agregarOtrosArchivos: false,
    }

    const [showModificar, setShowModificar] = useState(false);
    const [display, setDisplay] = useState(initialDisplay)
    const [showAgregarMaterial, setShowAgregarMaterial] = useState(false);

    const [formValue, handleInputChange, reset ] = useForm();

    const idMix = materialId.match.params.mix;

    const [mix, setMix] = useState([])
    const [mixes, setMixes] = useState([])

    const obtenerDatosMaterial = () => {
        axios.get(`${uri}/materiales_detalle/material/${idMix}`)
            .then(res => {
                const listadoMix = res.data.data.listadoDetallePorMaterial;
                setMix(listadoMix)
            }) 
    }  

    const obtenerDatosMixes = () => {
        axios.get(`${uri}/materiales/${idMix}`)
            .then(res => {
                const listadoMixes = res.data.data.material;
                setMixes(listadoMixes)
            }) 
    }  

    useEffect(() => {
        
        obtenerDatosMaterial();
        obtenerDatosMixes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAgregarMaterial = () => {
        setDisplay(initialDisplay);
        if(showAgregarMaterial){
            setShowAgregarMaterial(false);
            reset();
        }
        else {
            setShowAgregarMaterial(true);
            reset();
        }
    }

    const handleCrearTrack = (e) => {
        e.preventDefault();

        if ( !formValue.descripcion || !formValue.estilo || !formValue.orden || !formValue.path){
            Swal.fire({
                title: 'Error!',
                text: 'Debe completar todos los datos para dar el alta del track',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            Swal.fire({
                title: 'Está seguro que desea crear el track?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, crear!'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${uri}/materiales_detalle/`, {...formValue, id_material: idMix} )
                    .then(res => {                    
                        Swal.fire(
                            'Creado!',
                            'El track se ha creado con éxito!',
                            'success'
                          )
                          obtenerDatosMaterial();
                          reset();
                          setDisplay(initialDisplay);
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
        }

    const handleCrearCarpeta = (e) => {
        e.preventDefault();
        
        if ( formValue.descripcion || formValue.estilo || formValue.orden || formValue.path || formValue.nameOtrosArchivos || formValue.pathOtrosArchivos ){
            Swal.fire({
                title: 'Error!',
                text: 'Los datos del track deben estar vacios',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else if ( !formValue.pathCarpeta ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe informar sólo la ruta de Dropbox del archivo comprimido',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else{
            Swal.fire({
                title: 'Está seguro que desea crear la carpeta comprimida?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, crear!'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    
                    const datosCarpeta = {
                        id_material: idMix,
                        descripcion: "Audio completo",
                        estilo: 'MIX COMPLETO',
                        path: formValue.pathCarpeta,
                        path_video: '',
                        orden: "20"
                    }

                    axios.post(`${uri}/materiales_detalle/`, datosCarpeta)
                    .then(res => {                    
                        Swal.fire(
                            'Creado!',
                            'La carpeta se ha creado con éxito!',
                            'success'
                          )
                          obtenerDatosMaterial();
                          setDisplay(initialDisplay);
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
                 })
        }
    }

    const handleCrearOtroArchivo = (e) => {
        e.preventDefault();
        
        if ( !formValue.nameOtrosArchivos || !formValue.pathOtrosArchivos ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe completar todos los datos',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }

        else{
            Swal.fire({
                title: 'Está seguro que desea crear el archivo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, crear!'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    
                    const datosArchivo = {
                        id_material: idMix,
                        descripcion: formValue.nameOtrosArchivos,
                        estilo: 'EXTRAS',
                        path: formValue.pathOtrosArchivos,
                        path_video: '',
                        orden: "30"
                    }

                    axios.post(`${uri}/materiales_detalle/`, datosArchivo)
                    .then(res => {                    
                        Swal.fire(
                            'Creado!',
                            'El archivo se ha creado con éxito!',
                            'success'
                          )
                          obtenerDatosMaterial();
                          setDisplay(initialDisplay);
                          reset();
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
    }

    const handleDisplay = (cambio) => {
        setDisplay(initialDisplay);
        setDisplay({...initialDisplay, ...cambio})
        reset();
    }

    const [idModificaciones, setIdModificaciones] = useState('');

    const handleModificarMaterial = (e) => {
        e.preventDefault();
        setIdModificaciones(e.target.value);
        setShowModificar(true);
    }

    const handleEliminarMaterial = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Estás seguro que deseas eliminar el track? No podrás revertirlo luego',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!'
          })
          .then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${uri}/materiales_detalle/${e.target.value}`)
                .then(res => {                    
                    Swal.fire(
                        'Eliminado!',
                        'El track se ha eliminado con éxito!',
                        'success'
                      )
                      obtenerDatosMaterial();
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

    const handleModificarConfirmar = () => {

        if(!formValue.descripcion & !formValue.estilo & !formValue.orden & !formValue.path & !formValue.path_video ){
            Swal.fire({
                title: 'Error!',
                text: 'Debe enviar algun dato para cambiar',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
        else{
            axios.put(`${uri}/materiales_detalle/${idModificaciones}`, formValue)
                        .then(res => {                    
                            Swal.fire(
                                'Confirmado!',
                                'El curso se ha modificado.',
                                'success'
                              )
                              setShowModificar(false);
                              setIdModificaciones('');
                              obtenerDatosMaterial();
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
        reset();
    }


    return (
        <div>
            <button className="btn btn-outline-info" onClick={() => history.goBack()}>Volver</button>
            <h2 className="display-1">{mixes?.descripcion}</h2>
            <div className="col">
                <div className="row btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-outline-light m-4"  onClick={() => handleAgregarMaterial()}>{(showAgregarMaterial) ? "Ocultar Menu" : "Menu Agregar Material"}</button>
                </div>

                <div className="row btn-group" role="group" aria-label="Basic example">
                    <NavLink 
                        exact 
                        activeClassName="active" 
                        className="navbar-brand" 
                        to={{
                            pathname: `/session/admin/instructores/${idMix}`,
                            state: {idMix: idMix}
                            }}>
                                <button type="button" className="btn btn-outline-light m-4">Ver instructores con el mix</button>
                    </NavLink>
                </div>
            </div>
            {
                (showAgregarMaterial)
                &&
                <>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-dark btn-outline-light mediumFont m-4"  onClick={() => handleDisplay({agregarTrack: !display.agregarTrack})}>{(display.agregarTrack) ? "- Agregar Track" : "+ Agregar Track"}</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-dark btn-outline-light mediumFont m-4"  onClick={() => handleDisplay({agregarCarpeta: !display.agregarCarpeta})}>{(display.agregarCarpeta) ? "- Agregar Mix completo" : "+ Agregar Mix completo"}</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-dark btn-outline-light mediumFont m-4"  onClick={() => handleDisplay({agregarOtrosArchivos: !display.agregarOtrosArchivos})}>{(display.agregarOtrosArchivos) ? "- Agregar otros archivos" : "+ Agregar otros archivos"}</button>
                    </div>
                </>
            }

            {
                (display.agregarTrack)
                &&
                <form className="mediumFont form-group">
                    <div className="container">
                        <div className="col-10">
                            <h2>Datos nuevo track</h2>
                            <div className="row">
                                <div className="col-6">
                                    <input type="number" className="form-control" name="orden" placeholder="Nº de Orden en el Mix" onChange={ handleInputChange }/>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <input type="text" className="form-control"  name="descripcion" placeholder="Nombre del track" onChange={ handleInputChange }/>
                                </div>
                                <div className="col-6">
                                    <select name="estilo" defaultValue="" onChange={ handleInputChange }>
                                        <option value="">Selecciona un estilo</option>
                                        <option value="EC">EC</option>
                                        <option value="ECP">ECP</option>
                                        <option value="MT">MT</option>
                                        <option value="BOX">BOX</option>
                                        <option value="LCH">LCH</option>
                                        <option value="SBOX">SBOX</option>
                                        <option value="CORE">CORE</option>
                                        <option value="RELAX">RELAX</option>
                                        <option value="BONUS">BONUS</option>
                                        <option value="COMBINADOS">COMBINADOS</option>
                                        <option value="MIX COMPLETO">MIX COMPLETO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <input type="text" className="form-control" name="path" placeholder="URL del AUDIO - DROPBOX" onChange={ handleInputChange }/>
                                </div>
                                <div className="col-6">
                                    <input type="text" className="form-control" name="path_video" placeholder="URL del VIDEO - DROPBOX" onChange={ handleInputChange }/>
                                </div>
                            </div>
                            <button className="btn btn-danger m-4" onClick={handleCrearTrack}>Crear track</button>
                        </div>
                    </div>
            </form>
            }

            {
                (display.agregarCarpeta)
                &&
                <form className="mediumFont form-group">
                        <div className="container">
                            <div className="col mt-2">
                                <h2>Carpeta comprimida - Mix Completo</h2>
                                <div className="col-6">
                                    <input type="text" className="form-control" name="pathCarpeta" placeholder="URL del archivo - DROPBOX" onChange={ handleInputChange }/>
                                </div>
                                <button className="btn btn-danger m-4" onClick={handleCrearCarpeta}>Crear carpeta</button>
                            </div>
                            </div>
                </form>
            }

            {
                (display.agregarOtrosArchivos)
                &&
                <form className="mediumFont form-group">
                        <div className="container">
                            <div className="col mt-2">
                                <h2>Otros Archivos</h2>
                                <div className="col-6">
                                    <input type="text" className="form-control" name="nameOtrosArchivos" placeholder="Descripcion del archivo" onChange={ handleInputChange }/>
                                    <input type="text" className="form-control mt-4" name="pathOtrosArchivos" placeholder="URL del Archivo - DROPBOX" onChange={ handleInputChange }/>
                                </div>
                                <button className="btn btn-danger m-4" onClick={handleCrearOtroArchivo}>Crear Archivo</button>
                            </div>
                        </div>
                    </form>
            }
            
            <div className="table-responsive-sm">
                <table id="tableTracks" className="table">
                    <thead>
                        <tr className="flex-nowrap w-100" >
                            <th id="colOrdenTrack" onClick={() => sortTable3(0) }  className="col-1 cursorPointer">Orden</th>
                            <th id="colNombreTrack" onClick={() => sortTable3(1) } className="col-2 cursorPointer">Nombre</th>
                            <th id="colEstiloTrack" onClick={() => sortTable3(2) } className="col-1 cursorPointer">Estilo</th>
                            <th id="colTipoTrack" onClick={() => sortTable3(3) } className="col-1 cursorPointer">Tipo</th>
                            <th id="colPathTrack" className="col-2 cursorPointer web">Dropbox AUDIO</th>
                            <th id="colPathVideoTrack" className="col-2 cursorPointer web">Dropbox VIDEO</th>
                            <th id="botonEliminar" className="col-3"></th>
                        </tr>
                    </thead>
                    <tbody >
                            {
                                mix?.map(material =>
                                    <tr key={material.id} className="flex-nowrap" > 
                                        <td className="col-1">{material.orden}</td>
                                        <td className="col-2">{material.descripcion}</td>
                                        <td className="col-1">{material.estilo}</td>
                                        <td className="col-1">{material.tipo_material}</td>
                                        <td className="col-2 overflow-auto web">{material.path}</td>
                                        <td className="col-2 overflow-auto web">{material.path_video}</td>
                                        <td className="col-3 web">
                                            <button className="btn btn-danger m-3" value={material.id} onClick={(e) => handleEliminarMaterial(e)}>Eliminar</button>
                                            <button className="btn btn-danger" value={material.id} onClick={(e) => handleModificarMaterial(e)}>Modificar</button>
                                        </td>
                                        <td className="col-3 responsive">
                                            <button className="btn" value={material.id} onClick={(e) => handleEliminarMaterial(e)}><i className="fas fa-trash-alt"></i></button>
                                            <button className="btn" value={material.id} onClick={(e) => handleModificarMaterial(e)}><i className="fas fa-edit"></i></button>
                                        </td>
                                    </tr>
                                )
                            }

                        <Modal show={showModificar} onHide={() => setShowModificar(false)}>
                            <Modal.Header className="text-dark">
                                <h1>Modificaciones</h1>
                                <h5>*Solo la informacion que desea a actualizar</h5>
                            </Modal.Header>
                            
                            <Modal.Body>
                                <form action="" className="flex-column">
                                    <input type="number" className="form-control" name="orden" placeholder="Nº de Orden en el Mix" onChange={ handleInputChange }/>
                                    <input type="text" className="form-control mt-3" name="descripcion" placeholder="Nombre del track" onChange={ handleInputChange } />
                                    <select name="estilo" className="mt-3" defaultValue="" onChange={ handleInputChange }>
                                        <option value="">Selecciona un estilo</option>
                                        <option value="EC">EC</option>
                                        <option value="ECP">ECP</option>
                                        <option value="MT">MT</option>
                                        <option value="BOX">BOX</option>
                                        <option value="LCH">LCH</option>
                                        <option value="SBOX">SBOX</option>
                                        <option value="CORE">CORE</option>
                                        <option value="RELAX">RELAX</option>
                                        <option value="BONUS">BONUS</option>
                                        <option value="COMBINADOS">COMBINADOS</option>
                                        <option value="MIX COMPLETO">MIX COMPLETO</option>
                                    </select>
                                    <input type="text" className="form-control mt-3" name="path" placeholder="URL del AUDIO - DROPBOX" onChange={ handleInputChange }/>
                                    <input type="text" className="form-control mt-3" name="path_video" placeholder="URL del VIDEO - DROPBOX" onChange={ handleInputChange }/>
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

                    </tbody>
                </table>
            </div>
        </div>

    )
}