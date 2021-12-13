import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Form, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { uri } from '../../config';

export const CursosInstructorTomados = ({idUsuario}) => {

    const [cursosAsignados, setCursosAsignados] = useState([])
    const [cursos, setCursos] = useState([]);
    const [instructor, setInstructor] = useState([]);


    const obtenerInfoUsuario = async (isMounted) => {
        try{
            const res = await axios.get(`${uri}/users/admin/${idUsuario}`);
            
            if(res.data.data.usuario.id_perfil === 5){
                const response = await axios.get(`${uri}/instructores/admin/usuario/${idUsuario}`);
                const idInstructor = response.data.data.id;
                setInstructor(response.data.data);
                
                if(isMounted){
                    const responseCurso = await axios.get(`${uri}/instructores_cursos/instructor/admin/${idInstructor}`)
                    setCursosAsignados(responseCurso.data.data.instructorConCursos);
                }
            }
        }
        catch(error){
            console.log('Hubo un error al obtener el usuario');
        }
    }

    const obtenerCursos = async (isMounted) => {
        try {
            const res = await axios.get(`${uri}/cursos/`);
            setCursos(res.data.data.cursos)
        } catch (error) {
            console.log('Hubo un error al obtener los cursos');
        }
    }

    useEffect(() => {
        let isMounted = true;
        obtenerInfoUsuario(isMounted);
        obtenerCursos(isMounted);
        return () => {isMounted = false};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
    const handleQuitarAsignacion = () => {
        seleccionQuitar.forEach(async idCurso => {
            try{
                await axios.delete(`${uri}/instructores_cursos/instructor/admin/${instructor.id}/${idCurso}`); 
            }
            catch(error){
                console.log('Hubo un error al eliminar la asignacion');
            }
        })
        obtenerInfoUsuario(true);
        obtenerCursos(true);
    }

    const handleAsignar = () => {
        seleccionAsignar.forEach(async idCurso => {
            try {
                await axios.post(`${uri}/instructores_cursos/`, {id_instructor: instructor.id, id_curso: idCurso});
            } catch (error) {
                Swal.fire(
                    'Error!',
                    'Error, revise que el usuario sea instructor. No puede asignar material a administradores',
                    'error'
                  )
            }
        })
        obtenerInfoUsuario(true);
        obtenerCursos(true);
    }
    
    let cursosPendientes =[];
    
    cursos.forEach(curso => {   
        const cursoEstaAsignado = cursosAsignados.find(cursoAsignado => cursoAsignado.id_curso === curso.id)
        if(!cursoEstaAsignado){
            cursosPendientes.push(curso);
        }
    })
    const [seleccionQuitar, setSeleccionQuitar] = useState([]);
    const [seleccionAsignar, setSeleccionAsignar] = useState([]);

    return (
        <div className="row">
            <div className="col m-2">
                <ul className="list-group">
                    <h2>Cursos asignados</h2>
                    <Form.Group as={Col} controlId="my_multiselect_field">
                        <Form.Control as="select" multiple value={seleccionQuitar} onChange={e => setSeleccionQuitar([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                            {
                                cursosAsignados?.map(curso =>
                                    <option key={curso.id_curso} value={curso.id_curso}>{curso.curso.nombre}</option>
                                    
                                )
                            }
                        </Form.Control>
                    </Form.Group>
                    <button className="btn-outline-danger text-dark" onClick={handleQuitarAsignacion}>Quitar asignacion</button>
                </ul>
            </div>
            <div className="col m-2">
                <ul className="list-group">
                <h2>Cursos no asignados</h2>
                    <Form.Group as={Col} controlId="my_multiselect_field">
                        <Form.Control as="select" multiple value={seleccionAsignar} onChange={e => setSeleccionAsignar([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                            {
                               cursosPendientes?.map(curso =>
                                <option key={curso.id}  value={curso.id}>{curso.nombre}</option>
                                )
                            }
                        </Form.Control>
                    </Form.Group>
                <button className="btn-outline-danger text-dark" onClick={handleAsignar}>Asignar</button>
                </ul>
            </div>
        </div>
    )
}
