import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { uri } from '../../config.js';
import { sortTable } from '../../funciones/sortTable.js';
import { MixesList } from './MixesList.js';
import { TrackVideo } from './TrackVideo.js';

export const MixesInst = () => {

const idInstructor = useSelector(state => state.idInstructor.id);
const {idCurso} = useSelector(state => state.idCurso);

const [curso, setCurso] = useState({});
const [mixesHabilitadosEnCurso, setMixesHabilitadosEnCurso] = useState([])

useEffect(() => {
    if(idCurso){
        axios.get(`${uri}/cursos/${idCurso}`)
            .then(res => {
                setCurso(res.data.data.curso);
                setMixesHabilitadosEnCurso([]);
                setListadoTracks([]);
            });
        axios.get(`${uri}/instructores_material/instructor/${idInstructor}/${idCurso}`)
        .then(res => {
            setMixesHabilitadosEnCurso(res.data.data.instructorConMix);
            setListadoTracks([]);
        })
        .catch(error => {
            console.log('Hubo un error al obtener el material del instructor');
        })
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [idCurso]);

const [listadoTracks, setListadoTracks] = useState([]);
const [ videoTrack , setVideoTrack ] = useState([]);

const handleChange = (e) => {
    setVideoTrack([]);
    const idMix = e.target.value;
    axios.get(`${uri}/materiales_detalle/material/${idInstructor}/${idMix}`)
        .then(res => {
            const listadoTracksPorMix = res.data.data.listadoDetallePorMaterial;
            setListadoTracks(listadoTracksPorMix);
        })
        .catch(error => {
            console.log('Error al obtener los detalles del Mix');
        })
}

const archivoMixCompleto = listadoTracks.find(track => track.estilo === "MIX COMPLETO");


    return (
        <div className="mixes-section">
            {
                (idCurso)

                ?

                <>

                    <h1>Programa actual: {curso.nombre}</h1>

                    {

                        (mixesHabilitadosEnCurso.length > 0)

                        ?

                        <select className="form-select selectorDeMixes" onChange={ handleChange } placeholder="selecciona un mix" defaultValue={"default"}>
                            <option value="default" disabled>Selecciona un Mix</option>
                            {
                                mixesHabilitadosEnCurso?.map(mix => <option value={ mix.material.id } key={ mix.material.id }>{ mix.material.descripcion }</option> )
                            }
                        </select>

                        :

                        <h2>No tiene material asignado para este programa</h2>
                    }

                </>
                
                :

                <h3>Elegí el programa</h3>
            }

            
            {

                (listadoTracks.length > 0)

                &&

                <>
                    {
                        (archivoMixCompleto)
                        &&
                        <a href={archivoMixCompleto.path}><button className="btn btn-danger mt-3">Descargar Mix Completo</button></a>
                    }
            
                    <Table id="tableSearch">
                        <thead>
                            <tr>
                                <th id="colMixSearch" onClick={() => sortTable(0) } scope="col">Mix</th>
                                <th id="colNumSearch" onClick={() => sortTable(1) } scope="col">Nº</th>
                                <th id="colStyleSearch" onClick={() => sortTable(2) } scope="col">Estilo</th>
                                <th id="colNameSearch" onClick={() => sortTable(3) } scope="col">Nombre</th>
                                <th id="colAudioVideo" scope="col"></th>
                            </tr>
                        </thead>

                        <MixesList listadoTracks={listadoTracks} setVideoTrack={ setVideoTrack } />

                    </Table>
                    
                    <TrackVideo video={ videoTrack } /> 
                </>  
            }


        </div>
    )
}
