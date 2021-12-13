import { types } from "../types/types"


const initialState = {
    loading: false,
    msgError: null
}

export const uiReducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case types.uiStartLoading:
            return {
                ...state,
                loading: true,
            }

        case types.uiFinishLoading:
            return {
                ...state,
                loading: false,
            }
            
        default:
            return state;
    }
}