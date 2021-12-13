import { Request, Response } from "express";
import { logger } from "..";
import Curso from "../models/curso";
import Instructor from "../models/instructor";
import Instructor_Curso from "../models/instructor_curso";

export const getCursos = async (req:Request ,res:Response) => {
    const cursos = await Curso.findAll();

    logger.info('Get de Cursos');
    res.json({
        mensaje: 'success',
        data: ({ cursos })
    })
};

export const getCurso = async (req:Request ,res:Response) => {
    
    const { id } = req.params;
    const curso = await Curso.findByPk( id );

    if( !curso ){
        res.status(404).json({
            mensaje: `No existe un curso con el id ${id}`
        })
    }
    else{
        logger.info(`Get de curso con el id ${id}`);
        res.json({
            mensaje: 'success',
            data: ({ curso })
        })
    }
};

export const getCursoUsuario = async (req:Request ,res:Response) => {

    const { idCurso } = req.params;
    const { idUsuario } = res.locals;

    logger.info(`Peticion del usuario ${idUsuario} del curso ${idCurso}`);
    

    const curso = await Curso.findByPk( idCurso );

    const instructorExiste = await Instructor.findOne({
        where: {
            id_usuario: idUsuario,
        }
    })

    if(!instructorExiste){
        logger.info(`Peticion del usuario ${idUsuario} que no existe`);
        res.status(404).json({
            mensaje: `No existe un instructor con el id de usuario ${idUsuario}`
        })
    }

    const idInstructor = instructorExiste?.getDataValue('id');

    const adquirioCurso =  await Instructor_Curso.findOne({
        where: {
            id_instructor: idInstructor,
            id_curso: idCurso,
        }
    })

    if( !adquirioCurso ){
        logger.info(`NO AUTORIZADO: El usuario con el ID de instructor ${idInstructor} no adquirió el curso con el ID ${idCurso}`);
        res.status(404).json({
            mensaje: `El usuario con el ID de instructor ${idInstructor} no adquirió el curso con el ID ${idCurso}`
        })
    }

    if( !curso ){
        logger.info(`NO AUTORIZADO: Se hizo una peticion con el ID ${idCurso} de curso que no existe`);
        res.status(404).json({
            mensaje: `No existe un curso con el id ${idCurso}`
        })
    }
    else{
        logger.info(`EXITOSA: peticion del usuario ${idUsuario} del curso ${idCurso}`);
        res.json({
            mensaje: 'success',
            data: ({ curso })
        })
    }
};

export const postCurso = async (req:Request ,res:Response) => {
    const {body} = req;
    
    if(!body.nombre) {
        logger.info(`ERROR: Post del curso sin enviar datos`);
        return res.json({
            estado: 'Error: Se debe enviar al menos el nombre del curso para crearlo'
        })
    }

    try {
        const existeCurso = await Curso.findOne({
            where: {
                nombre: body.nombre,
            }
        })

        if(existeCurso) {
            logger.info(`ERROR: Post del curso repetido`);
            return res.status(500).json({
                mensaje: 'Ya existe un curso con el nombre ' + body.nombre
            })
        }

        const curso = Curso.build(body);
        await curso.save();
        logger.info(`EXITO: Se creo el curso nuevo`);
        res.json( curso );
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error: Hable con el administrador',
        })
    }
};

export const putCurso = async (req:Request ,res:Response) => {
    const {id} = req.params;
    const {body} = req;

    try {
        const curso = await Curso.findByPk( id );
        if(!curso){
            logger.info(`ERROR: Se modifico un curso con id ${id} que no existe`);
            return res.status(404).json({
                mensaje: 'No existe un curso con el id ' + id
            })
        }
        await curso.update( body );
        logger.info(`EXITO: Se modifico el curso con el id ${id}`);
        res.json( curso );
    } catch (error) {
        logger.info(`ERROR: Error al modificar el curso de id ${id}`);
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const habilitarCurso = async (req:Request ,res:Response) => {

    const {id} = req.params;

    try {

        const curso = await Curso.findByPk( id );

        if(!curso){
            logger.info(`ERROR: Se intento habilitar el curso con el id ${id}`);
            return res.status(404).json({
                mensaje: 'No existe un curso con el id ' + id
            })
        }

        await curso.update({activo:true});
        logger.info(`EXITO: Se habilito el curso ${id}`);
        res.json( curso );
        
        
    } catch (error) {
        logger.info(`ERROR: Error al habilitar el curso de id ${id}`);
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const deleteCurso = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const curso = await Curso.findByPk( id );

        if(!curso){
            logger.info(`ERROR: Se intento borrar un curso inexistente con id ${id}`);
            return res.status(404).json({
                mensaje: 'No existe un curso con el id ' + id
            })
        }

        await curso.update({activo:false});
        logger.info(`EXITO: Se deshabilito el curso ${id}`);
        res.json({
            mensaje: 'El curso ha sido deshabilitado con éxito!'
        })
};

