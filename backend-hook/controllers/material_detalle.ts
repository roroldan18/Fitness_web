import { Request, Response } from "express"
import Instructor from "../models/instructor";
import Instructor_Material from "../models/instructor_material";
import Material from "../models/material";
import Material_detalle from "../models/material_detalle";



//Listar todo el material
export const getMaterialDetalle = async (req:Request ,res:Response) => {

    const listaMateriales = await Material_detalle.findAll({
        include: [Material]
    });

    res.json({
        mensaje: 'success',
        data: ({ listaMateriales })
    })
};

//Listar por ID del material
export const getMaterialDetallePorID = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const existeMaterial = await Material_detalle.findOne(
        {
            include: [Material],
            where: {
                id: id
            }
        }
    );

    if( !existeMaterial ){
        res.status(404).json({
            mensaje: `No existe un material con el id ${id}`
        })
    }

    else{
        const descripcionMaterial = existeMaterial?.getDataValue('descripcion');

        res.json({
            mensaje: 'success',
            descripcion: `${descripcionMaterial}`,
            data: ({ existeMaterial })
        })
    }
};

export const getMaterialPorIDMaterial = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const existeMaterial = await Material.findByPk( id );

    if( !existeMaterial ){
        res.status(404).json({
            mensaje: `No existe un Material con el id ${id}`
        })
    }

    const listadoDetallePorMaterial = await Material_detalle.findAll({
        include: [{
            model: Material,
            where:{
                id: id,
            }
        }]
    })

    res.json({
            mensaje: 'success',
            data: ({ listadoDetallePorMaterial })
        })
};

export const getMaterialInstructorPorIdMaterial = async (req:Request ,res:Response) => {

    const { idInstructorParams, idMix } = req.params;

    const existeMaterial = await Material.findByPk( idMix );
    const existeInstructor = await Instructor.findByPk( idInstructorParams );

    const instructorTieneMaterial = await Instructor_Material.findOne({where:{
        id_instructor: idInstructorParams,
        id_material: idMix
    }})

    if( !existeMaterial ){
        res.status(404).json({
            mensaje: `No existe un Material con el id ${idMix}`
        })
    }

    if( !existeInstructor ){
        res.status(404).json({
            mensaje: `No existe un Instructor con el id ${idInstructorParams}`
        })
    }
    if( !instructorTieneMaterial ){
        res.status(404).json({
            mensaje: `El instructor con el id ${idInstructorParams} no compro el mix con el id ${idMix}`
        })
    }

    const listadoDetallePorMaterial = await Material_detalle.findAll({
        include: [{
            model: Material,
            where:{
                id: idMix,
            }
        }]
    })

    res.json({
            mensaje: 'success',
            data: ({ listadoDetallePorMaterial })
        })
};

export const crearDetalle = async (req:Request, res:Response) => {

    const {body} = req;

    try {
        
        if( !body.id_material || !body.descripcion || !body.estilo || !body.path || !body.orden ){
            return res.status(404).json({
                mensaje: 'Todos los datos son obligatorios para dar el alta'
            })
        }

        const existeMaterial = await Material.findOne({
            where: {
                id: body.id_material,
            }
        })

        if (!existeMaterial) {
            return res.status(404).json({
                mensaje: 'No existe un Material con el id ' + body.id_material
            })
        }

        const existePath = await Material_detalle.findOne({
            where: {
                path: body.path,
            }
        })

        if (existePath) {
            return res.status(404).json({
                mensaje: 'La ruta enviada ya está utilizada en otro material'
            })
        }


        const nuevoMaterialDetalle = Material_detalle.build({
            id_material: body.id_material,
            descripcion: body.descripcion,
            estilo: body.estilo,
            path: body.path,
            path_video: body.path_video,
            orden: body.orden
        });

        await nuevoMaterialDetalle.save();

        res.json( nuevoMaterialDetalle );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error: Hable con el administrador',
        })
    }
}

export const putMaterialDetalle = async (req:Request ,res:Response) => {

    const {id} = req.params;
    const {body} = req;

    if(body.id_material){
        return res.status(500).json({
            mensaje: 'Error: El id del material no se puede modificar'
        })
    }

    try {

        const materialDetalle = await Material_detalle.findByPk( id );

        if(!materialDetalle){
            return res.status(404).json({
                mensaje: 'No existe un Detalle con el id ' + id
            })
        }

        await materialDetalle.update( body );

        res.json( materialDetalle );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }

    
};

export const deleteMaterialDetalle = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const material_detalle = await Material_detalle.findByPk( id );

        if(!material_detalle){
            return res.status(404).json({
                mensaje: 'No existe un detalle con el id ' + id
            })
        }

        await material_detalle.destroy();
        res.json({
            mensaje: 'El material ha sido borrado con éxito!'
        })

};

