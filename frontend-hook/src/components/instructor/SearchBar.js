import React, { useEffect, useMemo, useState } from 'react';
import { Form, FormControl, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useForm } from '../../hooks/useForm';
import { getTrackByName } from '../../funciones/getTrackByName';
import { MixesList } from './MixesList';
import { getTrackByStyle } from '../../funciones/getTrackByStyle';
import { sortTable } from '../../funciones/sortTable';
import { TrackVideo } from './TrackVideo';
import axios from 'axios';
import { uri } from '../../config';
import { useSelector } from 'react-redux';

export const SearchBar = ( {history} ) => {

    const {idCurso} = useSelector(state => state.idCurso);
    const idInstructor = useSelector(state => state.idInstructor.id)
    const [curso, setCurso] = useState({});

    const location= useLocation();
    const { q = '' } = queryString.parse( location.search );

    const [mixesInstructor, setMixesInstructor] = useState([]);

    useEffect(() => {

        if(idCurso){
            axios.get(`${uri}/instructores_material/instructor/detalle/${idInstructor}/${idCurso}`)
            .then(res => {
                setMixesInstructor(res.data.data.instructorConMixDetalle)
            })
            .catch(error => {
                console.log('Error al obtener los datos del material');
            });

            axios.get(`${uri}/cursos/${idCurso}`)
                .then(res => {
                    setCurso(res.data.data.curso);
                })
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idCurso])


    

    const [ formValues, handleInputChange ] = useForm( {
        searchText: q
    } ); 
    
    const { searchText } = formValues;
    

    const handleSearch = (e) => {
        e.preventDefault();
        history.push(`?q=${ searchText }`);
    }

    const tracksFilteredByName = useMemo( () => getTrackByName( q, mixesInstructor ), [q, mixesInstructor] );
    const tracksFilteredByStyle = useMemo( () => getTrackByStyle( q, mixesInstructor ), [q, mixesInstructor] );
    const filteredUnified = [...tracksFilteredByName, ...tracksFilteredByStyle];
    const tracksFiltered = [...new Set(filteredUnified)]
    const [ videoTrack , setVideoTrack ] = useState('');


    return (
        <>
        {
                (idCurso)
                
                ?

                <>

                <h1>Programa actual: {curso.nombre}</h1>

                <Form inline='true' onSubmit={ handleSearch } className="mt-4">
                    <FormControl 
                        type="text" 
                        placeholder="Busca por nombre o estilo" 
                        className="mr-sm-2 barraBusqueda" 
                        name="searchText" 
                        value={ searchText }
                        onChange={ handleInputChange }
                        autoComplete="off"/>
                    <button className="btn btn-danger ms-3">Buscar</button>
                </Form>

                <div>

                    {

                    (q !=='' && tracksFiltered.length === 0) 

                    &&

                    <div className="alert alert-danger">
                        No hay un track: { q }
                    </div>

                    }

                    {
                        (tracksFiltered.length > 0)

                        &&
                        
                        <>
                        <Table id="tableSearch">
                            <thead>
                                <tr>
                                    <th id="colMixSearch" onClick={() => sortTable(0) } scope="col">Mix</th>
                                    <th id="colNumSearch" onClick={() => sortTable(1) } scope="col">Nº</th>
                                    <th id="colStyleSearch" onClick={() => sortTable(2) } scope="col">Estilo</th>
                                    <th id="colNameSearch" onClick={() => sortTable(3) } scope="col">Nombre</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>

                            <MixesList listadoTracks={tracksFiltered} setVideoTrack={ setVideoTrack } /> 

                        </Table>

                        <TrackVideo video={ videoTrack } />
                        
                        </>
                    }

                </div>
                </>

                :

                <h2>Primero elegi el programa</h2>            
        }
        </>
    )
}

