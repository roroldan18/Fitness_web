import { Request, Response } from "express"
import Curso from "../models/curso";
import Instructor from "../models/instructor";
import Instructor_Curso from "../models/instructor_curso";
import Instructor_Material from "../models/instructor_material";
import Material from "../models/material";


export const getMateriales = async (req:Request ,res:Response) => {

    const material = await Material.findAll({
        include: [Curso]
    });

    res.json({
        mensaje: 'success',
        data: ({ material })
    })
};

export const getMaterialesPorCurso = async (req:Request ,res:Response) => {

    const {idCurso} = req.params;
    const {idUsuario} = res.locals;
    
    const material = await Material.findAll({
        include: [{
            model: Curso,
            where: {
                id: idCurso,
            }
        }]
    });

    const instructorExiste = await Instructor.findOne({
        where:{
            id_usuario: idUsuario
        }
    })

    if(!instructorExiste){
        res.status(404).json({
            mensaje: `El instructor con el ID de Usuario ${idUsuario} no existe. Validar que sea un instructor`
        })
    }

    const idInstructor = instructorExiste?.getDataValue('id');

    const adquirioCurso = await Instructor_Curso.findOne({
        where:{
            id_instructor: idInstructor,
            id_curso: idCurso
        }
    })

    if( !adquirioCurso ){
        res.status(404).json({
            mensaje: `El instructor con el ID ${idInstructor} no adquirio el curso con el ID ${idCurso}`
        })
    }

    res.json({
        mensaje: 'success',
        data: ({ material })
    })
};

export const getMaterialesAdminPorCurso = async (req:Request ,res:Response) => {

    const {idCurso} = req.params;
    
    const material = await Material.findAll({
        include: [{
            model: Curso,
            where: {
                id: idCurso,
            }
        }]
    });

    res.json({
        mensaje: 'success',
        data: ({ material })
    })
};


export const getMaterial = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const material = await Material.findByPk( id );

    if( !material ){
        res.status(404).json({
            mensaje: `Get Material: No existe un mix con el id ${id}`
        })
    }
    else{
        res.json({
            mensaje: 'success',
            data: ({ material })
        })
    }
};

export const postMaterial = async (req:Request ,res:Response) => {

    const {body} = req;

    if( !body.descripcion || !body.id_curso ){
        res.status(404).json({
            mensaje: 'Debe enviar el nombre del Mix y el curso asociado'
        })
    }
    try {

        const existeDescripcion = await Material.findOne({
            where: {
                descripcion: body.descripcion,
                id_curso: body.id_curso
            }
        })

        if(existeDescripcion) {
            return res.status(500).json({
                mensaje: 'Ya existe un Mix con el nombre ' + body.descripcion + ' para el id del curso '+ body.id_curso
            })
        }

        const material = Material.build(body);
        await material.save();

        res.json( material );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error: Hable con el administrador',
        })
    }
};

export const putMaterial = async (req:Request ,res:Response) => {

    const {id} = req.params;
    const {body} = req;

    try {

        const material = await Material.findByPk( id );

        if(!material){
            return res.status(404).json({
                mensaje: 'Put Material: No existe un Mix con el id ' + id
            })
        }

        if(body.id_curso){
            const descripcion = material.getDataValue('descripcion');

            const existeDescripcion = await Material.findOne({
                where: {
                    descripcion: descripcion,
                    id_curso: body.id_curso
                }
            })

            if(existeDescripcion) {
                return res.status(404).json({
                    mensaje: `No puede asignar el ${descripcion} al id del curso ${body.id_curso} porque ya existe uno con ese nombre, primero cambie el nombre del Mix si quiere asignarlo de todas formas.`
                })
            }
        }

        await material.update( body );

        res.json( material );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const habilitarMaterial = async (req:Request ,res:Response) => {

    const {id} = req.params;

    try {

        const material = await Material.findByPk( id );

        if(!material){
            return res.status(404).json({
                mensaje: 'habilitarMaterial: No existe un Mix con el id ' + id
            })
        }

        await material.update({activo: true});

        res.json( material );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const deleteMaterial = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const material = await Material.findByPk( id );

        if(!material){
            return res.status(404).json({
                mensaje: 'deleteMaterial: No existe un Mix con el id ' + id
            })
        }

        await material.update({activo: false});

        res.json({
            mensaje: 'El Mix ha sido deshabilitado con éxito!',
            material
        })

};

