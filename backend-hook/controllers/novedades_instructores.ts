import { Request, Response } from "express";
import Novedades_instructores from "../models/novedades_instructores";


export const getNovedades = async (req:Request ,res:Response) => {

    const novedades = await Novedades_instructores.findAll();

    res.json({
        mensaje: 'success',
        data: ({ novedades })
    })
};

export const getNovedadesActivas = async (req:Request ,res:Response) => {

    const novedades = await Novedades_instructores.findAll({
        where: {
            habilitado: 1
        }
    });

    res.json({
        mensaje: 'success',
        data: ({ novedades })
    })
};

export const getNovedad = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const novedad = await Novedades_instructores.findByPk( id );

    if( !novedad ){
        res.status(404).json({
            mensaje: `No existe novedad con el id ${id}`
        })
    }
    else{
        res.json({
            mensaje: 'success',
            data: ({ novedad })
        })
    }
};


export const postNovedad = async (req:Request ,res:Response) => {

    const {body} = req;
    
    if(!body.path_imagen || !body.path_destino) {
        return res.json({
            estado: 'Error: Se debe enviar al menos la url de la imagen y del destino'
        })
    }

    try {

        const existeNovedad = await Novedades_instructores.findOne({
            where: {
                path_destino: body.path_destino,
            }
        })

        if(existeNovedad) {
            return res.status(500).json({
                mensaje: 'Ya existe una novedad con el destino: ' + body.path_destino
            })
        }

        const novedad = Novedades_instructores.build(body);
        await novedad.save();

        res.json( novedad );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error: Hable con el administrador',
        })
    }
};

export const putNovedad = async (req:Request ,res:Response) => {

    const {id} = req.params;
    const {body} = req;

    try {

        const novedad = await Novedades_instructores.findByPk( id );

        if(!novedad){
            return res.status(404).json({
                mensaje: 'No existe una novedad con el id ' + id
            })
        }

        await novedad.update( body );

        res.json( novedad );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};


export const deshabilitarNovedad = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const novedad = await Novedades_instructores.findByPk( id );

        if(!novedad){
            return res.status(404).json({
                mensaje: 'No existe una novedad con el id ' + id
            })
        }

        if(!novedad.getDataValue("habilitado")){
            return res.status(404).json({
                mensaje: 'La novedad ya se encuentra deshabilitada'
            })
        }

        await novedad.update({habilitado:false});
        res.json({
            mensaje: 'La novedad ha sido deshabilitada con éxito!'
        })
};
export const habilitarNovedad = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const novedad = await Novedades_instructores.findByPk( id );

        if(!novedad){
            return res.status(404).json({
                mensaje: 'No existe una novedad con el id ' + id
            })
        }

        if(novedad.getDataValue("habilitado")){
            return res.status(404).json({
                mensaje: 'La novedad ya se encuentra habilitada'
            })
        }

        await novedad.update({habilitado:true});
        res.json({
            mensaje: 'La novedad ha sido habilitada con éxito!'
        })
};

export const deleteNovedad = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const novedad = await Novedades_instructores.findByPk( id );

        if(!novedad){
            return res.status(404).json({
                mensaje: 'No existe una novedad con el id ' + id
            })
        }

        await novedad.destroy();
        res.json({
            mensaje: 'La novedad ha sido eliminada con éxito!'
        })
};
