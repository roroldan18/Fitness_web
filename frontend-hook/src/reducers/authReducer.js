import { types } from "../types/types.js";

const initialState = { 
    checking: true
}


export const authReducer = (state = initialState, action) => {

    switch ( action.type ) {
        case types.login:
            return {
                ...state,
                ...action.payload,
                checking:false,
            }

        case types.authCheckingFinish:
            return {
                ...state,
                checking:false,
            }

        case types.idUsuarioAsignado:
            return {
                ...state,
                ...action.payload
            }

        case types.logout:
            return {
                checking: false
            }
            
        default:
            return state;
    }
}


