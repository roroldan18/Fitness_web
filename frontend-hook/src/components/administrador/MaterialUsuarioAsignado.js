import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Form, Col } from 'react-bootstrap';
import { uri } from '../../config.js';

export const MaterialUsuarioAsignado = ({idUsuario}) => {

    const [cursosAsignados, setCursosAsignados] = useState([])
    const [materialesPendientes, setMaterialesPendientes] = useState([])
    const [materialesAsignados, setMaterialesAsignados] = useState([])
    const [instructor, setInstructor] = useState([]);
    const [idCursoSeleccionado, setIdCursoSeleccionado] = useState('');


    const obtenerInstructorYCursoAsignado = async (isMounted) => {
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
            else{
                console.log('El usuario no es instructor');
            }
        }
        catch(error){
            console.log('Hubo un error al obtener informacion del usuario');
        }
    }



const obtenerMaterialPorCurso = async () => {
    let materialesCursoActivo = [];
    let mixesAsignados = [];
    
    try {
        //ACA ESTA EL ERROR 
        if(idCursoSeleccionado !== ''){
            var res = await axios.get(`${uri}/materiales/admin/curso/${idCursoSeleccionado}`);
            materialesCursoActivo = res.data.data.material;
        }
    } catch (error) {
        materialesCursoActivo = [];
    }

    try {
        if(idCursoSeleccionado !== ''){
            const response = await axios.get(`${uri}/instructores_material/admin/instructor/${instructor.id}/${idCursoSeleccionado}`)
            mixesAsignados = response.data.data.instructorConMix;
            await setMaterialesAsignados(response.data.data.instructorConMix);
    
            let materialesPendientesArray =[];  
            materialesCursoActivo.forEach(material => {
                const materialEstaAsignado = mixesAsignados.find(materialAsignado => materialAsignado.material.id === material.id)
                if(!materialEstaAsignado){
                    materialesPendientesArray.push(material);
                }
            })
            setMaterialesPendientes(materialesPendientesArray);
        }            
        
    } catch (error) {
        await setMaterialesAsignados([]);
        await setMaterialesPendientes(materialesCursoActivo);
    }   
}

    useEffect(() => {
        let isMounted = true;
        obtenerInstructorYCursoAsignado(isMounted);
        return () => {isMounted = false}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        obtenerMaterialPorCurso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idCursoSeleccionado]);

    

    
    const handleQuitarAsignacion = () => {
        seleccionQuitar.forEach(async idMaterial => {

            try{
                await axios.delete(`${uri}/instructores_material/${instructor.id}/${idMaterial}`); 
            }
            catch(error){
                console.log('Hubo un error al quitar la asignacion');
            }
        })
        obtenerInstructorYCursoAsignado(true);
        obtenerMaterialPorCurso();
    }
    

    const handleAsignar = () => {
        seleccionAsignar.forEach(async idMaterial => {
            try {
                await axios.post(`${uri}/instructores_material/instructor/${instructor.id}`, {id_material: idMaterial});
            } catch (error) {
                console.log('Hubo un error al agregar la asignacion');
            }
        })
        obtenerInstructorYCursoAsignado(true);
        obtenerMaterialPorCurso();
    }
    
    const [seleccionQuitar, setSeleccionQuitar] = useState([]);
    const [seleccionAsignar, setSeleccionAsignar] = useState([]);


    return (
        <>
        <div>
            <select name="cursoSeleccionado" defaultValue="default" onChange={(e) => {setIdCursoSeleccionado(e.target.value)}}>
                <option value="default" disabled>Selecciona un programa</option>
                {
                    cursosAsignados.map(curso => 
                        <option key={curso.curso.id} value={curso.curso.id}>{curso.curso.nombre}</option>
                    )
                }
            </select>
        </div>
        <div className="row">
            <div className="col m-2">
                <ul className="list-group">
                    <h2>Material asignado</h2>
                    <Form.Group as={Col} controlId="my_multiselect_field">
                        <Form.Control as="select" multiple value={seleccionQuitar} onChange={e => setSeleccionQuitar([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                            {
                                materialesAsignados?.map(material =>
                                    <option key={material.material.id}  value={material.material.id}>{material.material.descripcion}</option>
                                    
                                )
                            }
                        </Form.Control>
                    </Form.Group>
                    <button onClick={handleQuitarAsignacion}>Quitar asignacion</button>
                </ul>
            </div>
            <div className="col m-2">
                <ul className="list-group">
                <h2>Material no asignado</h2>
                    <Form.Group as={Col} controlId="my_multiselect_field">
                        <Form.Control as="select" multiple value={seleccionAsignar} onChange={e => setSeleccionAsignar([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                            {
                               materialesPendientes?.map(material =>
                                <option key={material.id} value={material.id}>{material.descripcion}</option>
                                )
                            }
                        </Form.Control>
                    </Form.Group>
                <button onClick={handleAsignar}>Asignar</button>
                </ul>
            </div>
        </div>
        </>
    )
}
