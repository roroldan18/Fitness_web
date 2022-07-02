import { types } from "../types/types.js";


export const idInstructorReducer = (state = "", action) => {

    switch ( action.type ) {
        case types.idInstructorAsignado:
            return {
                ...action.payload
            }

        case types.eliminarIdInstructorAsignado:
            return {}
            
        default:
            return state;
    }
}


