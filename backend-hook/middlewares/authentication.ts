import Token from "../class/token";
import { NextFunction, Response } from 'express';
import Usuario from "../models/user";
import Instructor from "../models/instructor";
import Auditoria from "../models/Auditoria";

export const verificarToken = (req:any, res:Response, next:NextFunction) => {

    const userToken = req.cookies.token || '';

    Token.checkToken(userToken)
        .then(decoded => {
            req.username = decoded.usuario.username;
            const refreshToken = Token.getToken(req.username)
            req.token = refreshToken;
            next()
        })
        .catch(error => {
            res.json({
                estado: 'success',
                mensaje: 'Token incorrecto',
                error: error
            })
        } )

}

export const validarAdmin = (req:any, res:Response, next:NextFunction) => {
    const userToken = req.cookies.token || '';

    Token.checkToken(userToken)
        .then(decoded => {
            req.id_perfil = decoded.usuario.id_perfil;
            if(req.id_perfil === 4){
                next()
            }
            else{
                res.json({
                    estado: 'success',
                    mensaje: 'Usuario no autorizado - Solo Administradores'
                })
            }
            
        })
        .catch(error => {
            res.json({
                estado: 'success',
                mensaje: 'Usuario no autorizado - Solo Administradores',
                error: error
            })
        } )
}

export const validarIdWithGet = (req:any, res:Response, next:NextFunction) => {
    const userToken = req.cookies.token || '';

    const id = req.params?.idUsuario;

    Token.checkToken(userToken)
        .then(decoded => {
            req.id = decoded.usuario.id;
            if(req.id == id){
                res.locals.idUsuario = decoded.usuario.id;
                next()
            }
            else{
                res.json({
                    estado: 'success',
                    mensaje: 'No podes consultar esta informacion'
                })
            }
            
        })
        .catch(error => {
            res.json({
                estado: 'success',
                mensaje: 'Usuario no autorizado',
                error: error
            })
        } )
}

export const validarHabilitado = (req:any, res:Response, next:NextFunction) => {
    const userToken = req.cookies.token || '';


    Token.checkToken(userToken)
        .then(async decoded => {
            req.habilitado = decoded.usuario.habilitado;
            if(req.habilitado === true){
                res.locals.idUsuario = decoded.usuario.id;
                next()
            }
            else{

                const auditoria = Auditoria.build({id_usuario: decoded.usuario.id});
                await auditoria.save();

                res.json({
                    estado: 'success',
                    mensaje: 'Usuario no habilitado'
                })
            }
            
        })
        .catch(error => {
            res.json({
                estado: 'success',
                mensaje: 'Error con Token',
                error: error
            })
        } )
}


export const validarIdInstructorWithGet = async (req:any, res:Response, next:NextFunction) => {
    
    const userToken = req.cookies.token || '';
    const {idInstructorParams} = req.params;

    Token.checkToken(userToken)
        .then( async (decoded) => {

            const idUsuario = decoded.usuario.id
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

            const idInstructor = await instructor?.getDataValue('id');

            if(idInstructor == idInstructorParams){
                res.locals.idInstructor = idInstructor;
                next();
            }
            else{
                res.json({
                    estado: 'success',
                    mensaje: "No puede obtener acceso de otro ID"
                })
            }
            }
        })
    
        .catch(error => {
            res.json({
                estado: 'success',
                mensaje: 'Error con Token',
                error: error
            })
        } )
}





