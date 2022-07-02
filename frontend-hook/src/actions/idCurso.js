import { types } from "../types/types.js";


export const cursoElegido = ( idCurso ) => ({
    type: types.cursoElegido,
    payload: {
        idCurso: idCurso
    }
})

export const noCurso = () => ({
    type: types.noCurso,
})