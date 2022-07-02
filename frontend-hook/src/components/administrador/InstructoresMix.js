import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Form, FormControl } from 'react-bootstrap';
import { uri } from '../../config.js';
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export const InstructoresMix = (idMix) => {

    const history = useHistory();
    const idMaterial = idMix.match.params.mix;
    console.log(idMix.match.params);
    const [mix, setMix] = useState([])
    const [instructoresAsignados, setInstructoresAsignados] = useState([])
    const [instructoresNoAsignados, setInstructoresNoAsignados] = useState([])
    const [instructoresNoAsignadosMostrar, setInstructoresNoAsignadosMostrar] = useState([])
    const [instructoresAsignadosMostrar, setInstructoresAsignadosMostrar] = useState([])
    const [seleccionQuitar, setSeleccionQuitar] = useState([]);
    const [seleccionAsignar, setSeleccionAsignar] = useState([]);

    const [searchTextSinCurso, setSearchTextSinCurso] = useState('');
    const [searchTextConCurso, setSearchTextConCurso] = useState('');

    const obtenerDatosMixes = async (isMounted) => {
        const res = await axios.get(`${uri}/materiales/${idMaterial}`);
            const listadoMixes = res.data.data.material;
            if(isMounted){
                await setMix(listadoMixes)
            }
    }  

    const obtenerDatosInstructores = async () => {
            const res = await axios.get(`${uri}/instructores_material/material/admin/${idMaterial}`)
            const instructoresConMix = res.data.data.mixConInstructor;
            await setInstructoresAsignados(instructoresConMix)
            await setInstructoresAsignadosMostrar(instructoresConMix)

            if(instructoresConMix[0]){
                const response = await axios.get(`${uri}/instructores_material/material/admin/${instructoresConMix[0].material.id_curso}/${idMaterial}`)
                const instructoresSinMix = response.data.data.listaInstructoresSinCursos;
                await setInstructoresNoAsignados(instructoresSinMix);
                await setInstructoresNoAsignadosMostrar(instructoresSinMix);
            }
            else{
                const response = await axios.get(`${uri}/materiales/${idMaterial}`)
                const idCursoActual = response.data.data.material.id_curso;

                const res = await axios.get(`${uri}/instructores_material/material/admin/${idCursoActual}/${idMaterial}`)
                const instructoresSinMix = res.data.data.listaInstructoresSinCursos;
                await setInstructoresNoAsignados(instructoresSinMix);
                await setInstructoresNoAsignadosMostrar(instructoresSinMix);
            }
    
    }

    useEffect(() => {
        let isMounted = true;
        obtenerDatosMixes(isMounted);
        obtenerDatosInstructores();
        return () => { isMounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    


    
    const handleQuitarAsignacion = async (e) => {


        let nombresQuitar = [];

        seleccionQuitar.forEach(idQuitar => {
            const instructorEncontrado = instructoresAsignados.find(instructor => instructor.instructor.id === parseInt(idQuitar));
            if(instructorEncontrado){
                nombresQuitar.push(instructorEncontrado.instructor.nombre + ' ' + instructorEncontrado.instructor.apellido);
            }
        })

        const nombresMostrar = nombresQuitar.join(', ');

        Swal.fire({
            title: `Está por quitar la asignacion de ${mix.descripcion} a los siguientes instructores: `,
            text: `${nombresMostrar}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Quitar!'
          }).then((result) => {
            if (result.isConfirmed) {
                seleccionQuitar.forEach(async idInstructor => {
                    try{
                        await axios.delete(`${uri}/instructores_material/${idInstructor}/${mix.id}`); 
                    }
                    catch(error){
                        Swal.fire(
                            'Error!',
                            'Hubo un error al quitar el material a algun instructor.',
                            'error'
                          )
                    }
                    await obtenerDatosInstructores();
                    setSeleccionQuitar([]);
                })
            }
        }) 
    }
    

    const handleAsignar = async () => {

        let nombresAsignar = [];

        seleccionAsignar.forEach(idAsignar => {
            const instructorEncontrado = instructoresNoAsignados.find(instructor => instructor.instructor.id === parseInt(idAsignar));
            if(instructorEncontrado){
                nombresAsignar.push(instructorEncontrado.instructor.nombre + ' ' + instructorEncontrado.instructor.apellido);
            }
        })

        const nombresMostrar = nombresAsignar.join(', ');

        Swal.fire({
            title: `Está por asignar el ${mix.descripcion} a los siguientes instructores: `,
            text: `${nombresMostrar}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Asignar!'
          }).then((result) => {
            if (result.isConfirmed) {
                seleccionAsignar.forEach(async idInstructor => {
                    try {
                        await axios.post(`${uri}/instructores_material/instructor/${idInstructor}`, {id_material: mix.id});
                        
                    } catch (error) {
                        Swal.fire(
                            'Error!',
                            'Hubo un error al asignar el material a algun instructor.',
                            'error'
                          )
                    }
                    await obtenerDatosInstructores();
                    setSeleccionAsignar([])
                })
            }
          })
    }

    instructoresAsignados.sort(function (a, b) {
        if (a.instructor.nombre > b.instructor.nombre) {
          return 1;
        }
        if (a.instructor.nombre < b.instructor.nombre) {
          return -1;
        }
        return 0;
      });

    instructoresNoAsignados.sort(function (a, b) {

        if (a.instructor?.nombre > b.instructor?.nombre || a.nombre > b.nombre) {
            return 1;
          }
          if (a.instructor?.nombre < b.instructor?.nombre || a.nombre < b.nombre) {
            return -1;
          }
          return 0;        
    });

    const changeAsignar = (e) => {
        let seleccionActual = seleccionAsignar;

        if (e.target.checked){
            seleccionActual.push(e.target.value);
            setSeleccionAsignar(seleccionActual);
        }
        if( !e.target.checked ){
            let nuevaSeleccion = seleccionActual.filter( valor => valor !== e.target.value );
            setSeleccionAsignar(nuevaSeleccion);
        }
} 

    const changeQuitar = (e) => {
        let seleccionActual = seleccionQuitar;
        if (e.target.checked){
            seleccionActual.push(e.target.value);
            setSeleccionQuitar(seleccionActual);
        } 
        if( !e.target.checked ){
            let nuevaSeleccion = seleccionActual.filter( valor => valor !== e.target.value );
            setSeleccionQuitar(nuevaSeleccion);
        }
    } 

    const handleSearchSinCurso = (e) => {
        setSearchTextSinCurso(e.target.value);
    };

    const handleSearchConCurso = (e) => {
        setSearchTextConCurso(e.target.value);
    };

    const handleListUsersSinCurso = () => {

        if(searchTextSinCurso === '' || searchTextSinCurso.trim() === ''){
            setInstructoresNoAsignadosMostrar(instructoresNoAsignados);
        }

        if(searchTextSinCurso !== ''){
            const usuariosFiltrados = instructoresNoAsignados.filter(usuario => 
                (usuario.instructor.nombre.toLocaleLowerCase().includes(searchTextSinCurso.toLocaleLowerCase()) || usuario.instructor.apellido.toLocaleLowerCase().includes(searchTextSinCurso.toLocaleLowerCase())));
                setInstructoresNoAsignadosMostrar(usuariosFiltrados);
        }
    }

    const handleListUsersConCurso = () => {

        if(searchTextConCurso === '' || searchTextConCurso.trim() === ''){
            setInstructoresAsignadosMostrar(instructoresAsignados);
        }

        if(searchTextConCurso !== ''){
            const usuariosFiltrados = instructoresAsignados.filter(usuario => 
                (usuario.instructor.nombre.toLocaleLowerCase().includes(searchTextConCurso.toLocaleLowerCase()) || usuario.instructor.apellido.toLocaleLowerCase().includes(searchTextConCurso.toLocaleLowerCase())));
                setInstructoresAsignadosMostrar(usuariosFiltrados);
        }
    }


    return (
        <div>
            <button className="btn btn-outline-info" onClick={() => history.goBack()}>Volver</button>
            <div>
                Material: <b>{mix.descripcion}</b> 
            </div>

            <div className="row">
            <div className="col m-2">
                <ul className="list-group">
                    <h2>Instructores con el material asignado</h2>
                    <FormControl
                        type="text" 
                        placeholder="Busca por usuario, nombre o apellido" 
                        className="mt-3 barraBusqueda" 
                        name="searchText" 
                        value={ searchTextConCurso }
                        onChange={ handleSearchConCurso }
                        autoComplete="off"/>
                    <button className="btn btn-danger small mt-4" onClick={handleListUsersConCurso}>Listar</button>

                    <Form.Group className="h-auto" as={Col} value={seleccionQuitar} onChange={changeQuitar}>
                        {
                            instructoresAsignadosMostrar?.map(instructor =>
                                <Form.Check key={instructor.instructor.id} type="checkbox" as="select" multiple>
                                    <Form.Check.Input value={instructor.instructor.id} />
                                    <Form.Check.Label>{instructor.instructor.nombre} {instructor.instructor.apellido}</Form.Check.Label>
                                </Form.Check>
                            )
                        }
                        <button onClick={handleQuitarAsignacion}>Quitar asignacion</button>
                    </Form.Group>
                </ul>
            </div>
            <div className="col m-2">
                <ul className="list-group">
                <h2>Instructores del curso sin el material asignado</h2>
                    <FormControl
                        type="text" 
                        placeholder="Busca por usuario, nombre o apellido" 
                        className="mt-3 barraBusqueda" 
                        name="searchText" 
                        value={ searchTextSinCurso }
                        onChange={ handleSearchSinCurso }
                        autoComplete="off"/>
                    <button className="btn btn-danger small mt-4" onClick={handleListUsersSinCurso}>Listar</button>

                    <Form.Group className="h-auto" as={Col} value={seleccionAsignar} onChange={changeAsignar}>
                        {
                            instructoresNoAsignadosMostrar?.map(instructor =>
                                <Form.Check key={instructor.instructor.id} type="checkbox" as="select" multiple>
                                    <Form.Check.Input   value={instructor.instructor.id}  />
                                    <Form.Check.Label>{instructor.instructor.nombre} {instructor.instructor.apellido}</Form.Check.Label>
                                </Form.Check>
                            )
                        }
                        <button onClick={handleAsignar}>Asignar</button>
                    </Form.Group>
                </ul>
            </div>
        </div>



        </div>
    )
}
