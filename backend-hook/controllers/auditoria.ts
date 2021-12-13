import { Request, Response } from "express";
import { logger } from "..";
import Auditoria from "../models/Auditoria";

export const auditoriaPost = async (req:Request ,res:Response) => {

    const idUsuario = req.body.id_usuario;
    
    if(!idUsuario) {
        return res.json({
            estado: 'Error: Se debe enviar al menos el idUsuario para crearlo'
        })
    }

    try {
        const auditoria = Auditoria.build({id_usuario: idUsuario});
        logger.info('Auditoria disparada');
        await auditoria.save();
        res.json( auditoria );
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error: Hable con el administrador',
        })
    }
};