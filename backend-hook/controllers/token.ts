import cookieParser from "cookie-parser";
import { NextFunction, Response, Request } from "express";
import Token from "../class/token";


export const validarToken = async (req:any ,res:Response, next:NextFunction) => {

    const userToken = req.cookies.token;

    Token.checkToken(userToken)
        .then(decoded => {
            req.id = decoded.usuario.id;
            req.username = decoded.usuario.username;
            req.id_perfil = decoded.usuario.id_perfil;
            req.correo = decoded.usuario.correo;
            req.habilitado = decoded.usuario.habilitado;
            req.cambiopass = decoded.usuario.cambiopass;
            req.acepto_terminos = decoded.usuario.acepto_terminos;

            const refreshToken = Token.getToken({
                id: req.id,
                username: req.username,
                id_perfil: req.id_perfil,
                correo: req.correo,
                habilitado: req.habilitado,
                cambiopass: req.cambiopass,
                acepto_terminos: req.acepto_terminos
            })
            
            req.token = refreshToken;
            
            res.json({
                usuario: decoded.usuario,
                ok: true,
            })
            next()
        })
        .catch(error => {
            res.json({
                estado: 'success',
                mensaje: 'Token incorrecto',
                ok: false,
                error: error
            })
        })
};

export const borrarCookies = async (req:any ,res:Response, next:NextFunction) => {

    res.cookie('token', { 
        httpOnly:true,
        sameSite: 'strict',
        maxAge: Date.now()
    });

    return res.json({
        estado: 'success',
        mensaje: 'Cookie eliminado'
    })
}
