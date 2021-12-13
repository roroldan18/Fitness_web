import { Request, Response } from "express"
import Instructor from "../models/instructor";
import Usuario from "../models/user";


export const getInstructores = async (req:Request ,res:Response) => {

    const instructores = await Instructor.findAll();

    res.json({
        mensaje: 'success',
        data: ({ instructores })
    })
};

export const getInstructor = async (req:Request ,res:Response) => {

    const { idInstructorParams } = req.params;

    const instructor = await Instructor.findByPk( idInstructorParams );

    if( !instructor ){
        res.status(404).json({
            mensaje: `No existe un instructor con el id ${idInstructorParams}`
        })
    }
    else{
        res.json({
            mensaje: 'success',
            data: ({ instructor })
        })
    }
};

export const getInstructorPorUsuario = async (req:Request ,res:Response) => {

    const { idUsuario } = req.params;

    const usuario = await Usuario.findByPk( idUsuario );

    if( !usuario ){
        res.status(404).json({
            mensaje: `No existe un usuario con el id ${idUsuario}`
        })
    }

    else{
        const instructor = await Instructor.findOne({
            include: [{model: Usuario, where: {id: idUsuario}}]
        });
        
        res.json({
            mensaje: 'success',
            data: instructor
        })
    }
};

export const putInstructor = async (req:Request ,res:Response) => {

    const {idInstructorParams} = req.params;
    const {body} = req;

    if(body.id_usuario){
        return res.status(500).json({
            mensaje: 'Error: El id del usuario no se puede modificar'
        })
    }

    try {

        const instructor = await Instructor.findByPk( idInstructorParams );

        if(!instructor){
            return res.status(404).json({
                mensaje: 'No existe un instructor con el id ' + idInstructorParams
            })
        }

        await instructor.update( body );

        res.json( instructor );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const deleteInstructor = async (req:Request ,res:Response) => {

    const { idInstructorParams } = req.params;

    const instructor = await Instructor.findByPk( idInstructorParams );

        if(!instructor){
            return res.status(404).json({
                mensaje: 'No existe un instructor con el id ' + idInstructorParams
            })
        }

        await instructor.destroy();
        res.json({
            mensaje: 'El instructor ha sido borrado con éxito!'
        })

};

