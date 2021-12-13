
import axios from "axios";
import {uri} from '../config.js';


const instructorDesdeUsuario = async (idUser) => {

    try{
        if(idUser !== undefined){
            const response = await axios.get(`${uri}/instructores/usuario/${idUser}`)
            const instructor = response.data.data;
            return instructor;
        }
    }
    catch(error) {
        console.log('Error al obtener los datos del instructor');
    }
}

export default instructorDesdeUsuario;