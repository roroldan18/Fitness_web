import { types } from "../types/types.js";


export const idInstructorAsignado = ( instructor ) => ({
    type: types.idInstructorAsignado,
    payload: {
        id: instructor.id,
        nombre: instructor.nombre,
        apellido: instructor.apellido,
        fecha_nacimiento: instructor.fecha_nacimiento,
        direccion: instructor.direccion,
        telefono: instructor.telefono,
        sexo: instructor.sexo,
        perfil_fb: instructor.perfil_fb,
        perfil_instagram: instructor.perfil_instagram,
        pais: instructor.pais,
        provincia: instructor.provincia,
        ciudad: instructor.ciudad,
        fuerzaCompletaDatos: instructor.fuerza_completa_datos,
    }
})

export const eliminarIdInstructorAsignado = () => ({
    type: types.eliminarIdInstructorAsignado,
})