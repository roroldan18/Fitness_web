import { Request, Response } from "express";
import { logger } from "..";
import Curso from "../models/curso";
import Instructor from "../models/instructor";
import Instructor_Curso from "../models/instructor_curso";


//Obtengo instructores con cursos
export const getInstructoresConCursos = async (req:Request ,res:Response) => {
    logger.info(`GET de todos los instructores y cursos`);

    const listaInstructoresConCursos = await Instructor_Curso.findAll({
        include: [Instructor, Curso]
    });

    res.json({
        mensaje: 'success',
        data: ({ listaInstructoresConCursos })
    })
};

//Listado por ID de instructor
export const getWithInstructor = async (req:Request ,res:Response) => {

    const { idInstructorParams } = req.params;

    logger.info(`GET de todos los cursos del instructor ${idInstructorParams}`);

    const instructorConCursos = await Instructor_Curso.findAll({
        include: [{model: Instructor,
        where: {
            id: idInstructorParams,
        }}, {model: Curso,
            where: {
                activo: true,
            }}]
    });

    const existeInstructor = await Instructor.findByPk( idInstructorParams );

    if( !existeInstructor ){
        logger.info(`ERROR: se hizo una solicitud de un instructor inexistente id: ${idInstructorParams}`);
        res.status(404).json({
            mensaje: `No existe un instructor con el id ${idInstructorParams}`
        })
    }

    if( instructorConCursos.length === 0){
        res.status(404).json({
            mensaje: `El usuario con el id ${idInstructorParams} no posee cursos asignados`
        })
    }

    else{
        const nombreInstructor = existeInstructor?.getDataValue('nombre');
        const apellidoInstructor = existeInstructor?.getDataValue('apellido');

        logger.info(`EXITO: Peticion de instructor de id ${idInstructorParams} con cursos`);

        res.json({
            mensaje: 'success',
            instructor: `${nombreInstructor} ${apellidoInstructor}`,
            data: ({ instructorConCursos })
        })
    }
};

//Listado por ID de curso
export const getWithCurso = async (req:Request ,res:Response) => {

    const { id } = req.params;

    logger.info(`GET: Peticion de instructores con el curso ${id}`);

    const instructoresEnElCurso = await Instructor_Curso.findAll({
        include: [{model: Curso,
        where: {
            id: id,
        }}, Instructor]
    });

    const existeCurso = await Curso.findByPk( id );

    if( !existeCurso ){
        logger.info(`ERROR: Peticion incorrecta. No existe un curso con el id ${id}`);
        res.status(404).json({
            mensaje: `No existe un curso con el id ${id}`
        })
    }

    if( instructoresEnElCurso.length === 0){
        res.status(404).json({
            mensaje: `El curso con el id ${id} no posee tiene ningun instructor inscripto`
        })
    }

    else{
        const nombreCurso = existeCurso?.getDataValue('nombre');
        logger.info(`EXITO: Peticion de instructores con el curso id: ${id}`);
        res.json({
            mensaje: 'success',
            curso: nombreCurso,
            data: ({ instructoresEnElCurso })
        })
    }
};




// Crear nueva asociacion de instructor con curso
export const postInstructor = async (req:Request ,res:Response) => {

    const { body } = req;
    logger.info(`POST: Creacion de instructor nuevo`);

    if(!body.id_instructor || !body.id_curso){
        return res.status(500).json({
            mensaje: 'Error: El id_instructor y el id_curso son obligatorios'
        })
    }

    try {

        const instructor = await Instructor.findByPk( body.id_instructor );

        if(!instructor){
            logger.info(`ERROR: No se puede crear una relacion de un instructor con id ${body.id_instructor} inexistente.`);
            return res.status(404).json({
                mensaje: 'No existe un instructor con el id ' + body.id_instructor
            })
        }

        const curso = await Curso.findByPk( body.id_curso )

        if(!curso){
            logger.info(`ERROR: No se puede crear una relacion de un curso con id ${body.id_curso} inexistente.`);
            return res.status(404).json({
                mensaje: 'No existe un curso con el id ' + body.id_curso
            })
        }

        const instructor_curso = Instructor_Curso.build(body);
        await instructor_curso.save();
        logger.info(`EXITO: Se creo una relacion entre el instructor con id ${body.id_instructor} y el curso con el id ${body.id_curso}`);

        res.json( instructor_curso );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }    
};


//Eliminar la asignacion del instructor al curso
export const deleteAsignacion = async (req:Request ,res:Response) => {

    const { idInstructorParams, idCurso } = req.params;
    logger.info(`DELETE: Borrado de asignacion del curso: ${idCurso} e instructor: ${idInstructorParams}`);

    if(!idInstructorParams || !idCurso){
        logger.info(`ERROR: Se esta intentando borrar el curso: ${idCurso} e instructor: ${idInstructorParams} pero alguno es inexistente`);
        return res.status(500).json({
            mensaje: 'Error: El id del instructor y el id del curso son obligatorios'
        })
    }

    try {

        const existeAsignacion = await Instructor_Curso.findOne({where:{
            id_instructor: idInstructorParams,
            id_curso: idCurso
        }})

        if(!existeAsignacion){
            logger.info(`ERROR: Se esta intentando una asignacion que no existe`);
            return res.status(500).json({
                estado: 'success',
                mensaje: 'Error: No existe la asignación que desea eliminar'
            })
        }

        await Instructor_Curso.destroy({where:{
            id_instructor: idInstructorParams,
            id_curso: idCurso
        }});

        logger.info(`EXITO: Se borro la relacion entre el curso: ${idCurso} y el instructor: ${idInstructorParams}`);

        res.json({
            mensaje: 'La asignacion de curso ha sido borrada con exito!'
        })
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }    
};




