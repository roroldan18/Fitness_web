import { Request, Response } from "express"
import Instructor from "../models/instructor";
import Instructor_Curso from "../models/instructor_curso";
import Instructor_Material from "../models/instructor_material";
import Material from "../models/material";
import { QueryTypes } from'sequelize';
import db from "../bin/connectionMySql";
import { Email } from "../class/email";
import Curso from "../models/curso";
import Usuario from "../models/user";
import { logger } from "..";


//Traer listado completo de instructores con el material.
export const getInstructoresConMixes = async (req:Request ,res:Response) => {

    const listaInstructoresConMixes = await Instructor.findAll({
        include: [Instructor_Material]
    });

    logger.info(`GET: Solicitud de todos los instructores con material`);

    res.json({
        mensaje: 'success',
        data: ({ listaInstructoresConMixes })
    })
};

//Listado por ID de instructor
export const getMixesWithInstructor = async (req:Request ,res:Response) => {

    const { idInstructorParams, idCurso } = req.params;

    logger.info(`GET: Solicitud de todos los materiales que tiene el instructor id: ${idInstructorParams}`);

    const instructorConMix = await Instructor_Material.findAll({
        include: [{model:Instructor, where: {id: idInstructorParams}}, {model:Material, where: {activo: true, id_curso: idCurso}}]
    });

    const existeInstructor = await Instructor.findByPk( idInstructorParams );

    if( !existeInstructor ){
        logger.info(`ERROR: Solicitud de un instructor id: ${idInstructorParams} que es inexistente`);
        res.status(404).json({
            mensaje: `No existe un instructor con el id ${idInstructorParams}`
        })
    }

    if( instructorConMix.length === 0){
        res.status(404).json({
            mensaje: `El usuario no posee materiales asignados para el curso elegido`
        })
    }

    else{
        logger.info(`EXITO: Solicitud de un instructor id: ${idInstructorParams}`);
        //Seguir con los loggers

        res.json({
            mensaje: 'success',
            data: ({ instructorConMix })
        })
    }
};


//Listado por ID de instructor + detalle de los mixes
export const getMixesWithInstructorDetalle = async (req:Request ,res:Response) => {

    const { idInstructorParams, idCurso } = req.params;

    const sqlQuery = `SELECT instructor_material.id_instructor, instructor_material.id_material, detalle.id, detalle.descripcion, detalle.estilo, 
    detalle.path, detalle.tipo_material, detalle.orden, detalle.path_video, material.descripcion as "mix", material.id_curso, material.activo
    FROM instructor_material
    LEFT JOIN material_detalle as detalle
    ON instructor_material.id_material = detalle.id_material
    RIGHT JOIN material ON instructor_material.id_material = material.id
    where instructor_material.id_instructor = ? and material.id_curso=? and material.activo=1;`;

    const instructorConMixDetalle = await db.query(sqlQuery, { replacements: [idInstructorParams, idCurso], type: QueryTypes.SELECT });    

    const existeInstructor = await Instructor.findByPk( idInstructorParams );

    if( !existeInstructor ){
        res.status(404).json({
            mensaje: `No existe un instructor con el id ${idInstructorParams}`
        })
    }

    if( instructorConMixDetalle.length === 0){
        res.status(404).json({
            mensaje: `El usuario no posee materiales asignados para el curso elegido`
        })
    }

    else{

        res.json({
            mensaje: 'success',
            data: ({ instructorConMixDetalle })
        })
    }
};

//Listado por ID de Material
export const getInstructoresWithMixes = async (req:Request ,res:Response) => {

    const { idMaterial } = req.params;

    const mixConInstructor = await Instructor_Material.findAll({
        include: [Instructor, {model: Material, where: {id: idMaterial}}]
    });

    const existeMix = await Material.findByPk( idMaterial );

    if( !existeMix ){
        res.status(404).json({
            mensaje: `getInstructoresWithMixes: No existe un mix con el id ${idMaterial}`
        })
    }

    else{

        res.json({
            mensaje: 'success',
            data: ({ mixConInstructor })
        })
    }
};

//Listado de instructores que no tienen un curso
export const getNoInstructoresWithMixes = async (req:Request ,res:Response) => {

    const { idCurso, idMaterial } = req.params;


    const existeMix = await Material.findByPk( idMaterial );

    if( !existeMix ){
        res.status(404).json({
            mensaje: `getNoInstructoresWithMixes: No existe un mix con el id ${idMaterial}`
        })
    }

    const listaInstructoresConCurso = await Instructor_Curso.findAll({ 
        include: [Instructor, Curso],
        where:{
            id_curso: idCurso,
        }
    });

    const listaInstructoresConMix = await Instructor_Material.findAll({
        where:{
            id_material: idMaterial
        }
    });

    let listaInstructoresSinCursos:any = [];
    
    //Recorro todos los instructores que tienen el curso y los comparo con los que tienen la asignacion
    listaInstructoresConCurso.forEach(instructor_curso => {
        const idInstructorCurso = instructor_curso.getDataValue('id_instructor')
        const coincidencia = listaInstructoresConMix.find(instructor_mix => idInstructorCurso === instructor_mix.getDataValue('id_instructor'))
        !coincidencia && listaInstructoresSinCursos.push(instructor_curso);
    })

    res.json({
        mensaje: 'success',
        data: ( { listaInstructoresSinCursos } )
    })
};

//Asignar Material al instructor
export const asignarMaterialAInstructor = async (req:Request, res:Response) => {

    const {idInstructorParams} = req.params;
    const {body} = req;

    try {
        if( !body.id_material ){
            return res.status(404).json({
                mensaje: 'Debe enviar el material a asignar'
            })
        }
        const existeMaterial = await Material.findOne({
            where: {
                id: body.id_material,
            }
        })
        if (!existeMaterial) {
            return res.status(404).json({
                mensaje: 'No existe un material con el id ' + body.id_material
            })
        }
        const existeInstructor = await Instructor.findOne({
            where: {
                id: idInstructorParams,
            }
        })
        if (!existeInstructor) {
            return res.status(404).json({
                mensaje: 'No existe un instructor con el id ' + idInstructorParams
            })
        }
        const instructorYaInscripto = await Instructor_Material.findOne({
            where: {
                id_instructor: existeInstructor?.getDataValue('id'),
                id_material: existeMaterial?.getDataValue('id')
            }
        })

        if(instructorYaInscripto){
            return res.status(404).json({
                mensaje: `El instructor con el ID ${idInstructorParams} ya tiene asociado el material con el id ${body.id_material}`
            })
        }
        const cursosInscriptos = await Instructor_Curso.findAll({
            where:{
                id_instructor: existeInstructor?.getDataValue('id'),
            }
        })

        const arrayCursosInscriptos : number[] = [];
        cursosInscriptos.forEach(curso => arrayCursosInscriptos.push(curso.getDataValue('id_curso')))
        const id_material_enviado = existeMaterial?.getDataValue('id_curso');
        const validacionInscripcionCurso = arrayCursosInscriptos.find(idCurso => idCurso == id_material_enviado)
        
        if(!validacionInscripcionCurso){
            return res.status(404).json({
                mensaje: 'Debe dar de alta el curso antes de asignar el material'
            })
        }

        const nombreInstructor = await existeInstructor.getDataValue('nombre');
        const apellidoInstructor = await existeInstructor.getDataValue('apellido');
        const idUsuario = await existeInstructor.getDataValue('id_usuario');
        const nombreMix = await existeMaterial.getDataValue('descripcion')

        const existeUsuario = await Usuario.findOne({
            where: {
                id: idUsuario,
            }
        })
        
        const {HOST, COMPANY_NAME} = process.env;

        const emailInstructor = await existeUsuario?.getDataValue('correo');
        

        const htmlMail = `Hola ${nombreInstructor} ${apellidoInstructor}! Se te ha asignado material nuevo.<br><br>
            Dirección Web: {HOST}<br>
            
            El siguiente material ha sido asignado a tu usuario: <br>
            <b>${nombreMix}<b>
            <br><br>

            Muchas Gracias.<br>
            {COMPANY_NAME}<br>
            `;

        const asuntoMail = "Asignacion de material";
            
        const emailAInstructor = new Email;
        emailAInstructor.enviarEmail(emailInstructor, asuntoMail,'', htmlMail);

        const nuevaAsignacionDeMaterial = await Instructor_Material.build({
            id_instructor: idInstructorParams,
            id_material: body.id_material
        });

        await nuevaAsignacionDeMaterial.save();

        res.json( nuevaAsignacionDeMaterial );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error: Hable con el administrador',
        })
    }
}

//Quitar asignacion de material
export const quitarAsignacionDeMaterial = async (req:Request ,res:Response) => {

        const {idInstructor, idMaterial} = req.params;

        try{
            if(!idInstructor || !idMaterial){
                return res.status(404).json({
                    mensaje: 'Se deben enviar los datos del Instructor y el material a asignar'
                })
            }
    
            const existeAsignacion = await Instructor_Material.findOne({
                where: {
                    id_instructor: idInstructor,
                    id_material: idMaterial,
                }
            })
    
            if(!existeAsignacion) {
                return res.status(404).json({
                    mensaje: `No existe una asignacion entre el instructor ${idInstructor} y el material ${idMaterial} para eliminar`
                })
            }
            
            await Instructor_Material.destroy({where: {
                id_instructor: idInstructor,
                id_material: idMaterial,
            }});
            
            res.json({
                mensaje: 'La asignacion de material ha sido borrada con exito!'
            })
        }
        catch(error) {
            res.status(500).json({
                mensaje: 'Error: Hable con el administrador',
            })

        };
}
