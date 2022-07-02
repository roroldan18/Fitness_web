import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { uri } from '../../config.js';
import { CarouselNovedades } from './CarouselNovedades.js';

export const NovedadesInst = () => {

    const [novedades, setNovedades] = useState([]);

     const obtenerDatosNovedades = async (isMounted) => {
         try{
           const res = await axios.get(`${uri}/novedades_instructores/activas/`);
           const listaNovedades = res.data.data.novedades;

           function compare( a, b ) {
            if ( a.descripcion < b.descripcion ){
              return -1;
            }
            if ( a.descripcion > b.descripcion ){
              return 1;
            }
            return 0;
          }

          listaNovedades.sort(compare);

           if(isMounted){
             setNovedades(listaNovedades)
           }
         }
         catch(error){
           console.log('Hubo un error al obtener las novedades');
         }
       }

    useEffect(() => {
      let isMounted = true;
      obtenerDatosNovedades(isMounted);
      return () => {isMounted = false};
    }, []);
    
    return (
        <div className="novedades">
            <h2>Bienvenido al sistema de instructores</h2>
            <hr />
            <CarouselNovedades novedades={novedades} />
        </div>

    )
}
