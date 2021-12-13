import { types } from "../types/types";


export const idCursoReducer = (state = "", action) => {

    switch ( action.type ) {
        case types.cursoElegido:
            return {
                idCurso: action.payload.idCurso
            }

        case types.noCurso:
            return {}
            
        default:
            return state;
    }
}


