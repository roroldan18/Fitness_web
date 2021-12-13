import { Request, Response } from "express"
import Usuario from "../models/user";
import Instructor from "../models/instructor";
import generator from 'generate-password';
import Instructor_Curso from "../models/instructor_curso";
import { Email } from "../class/email";
import bcrypt from 'bcrypt';
import Token from "../class/token";
import cookie from 'cookie-parser';
import { borrarCookies } from "./token";


export const getUsuarios = async (req:Request ,res:Response) => {

    const usuarios = await Usuario.findAll({include: Instructor});

    res.json({
        mensaje: 'success',
        data: ({ usuarios })
    })
};

export const getFilteredUsuarios = async (req:Request ,res:Response) => {

    const { body } = req;

    if(body){
        const usuarios = await Usuario.findAll(
            {   include: Instructor,
                where:body
            }, 
            );
            return res.json({
                mensaje: 'success',
                data: ({ usuarios })
            })
    }
    
    else if( !body ){
        const usuarios = await Usuario.findAll(
            {   include: Instructor
            }, 
            );
            return res.json({
                mensaje: 'success',
                data: ({ usuarios })
            })
    }

};

export const getUsuario = async (req:Request ,res:Response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByPk( id );

    if( !usuario ){
        res.status(404).json({
            mensaje: `No existe un usuario con el id ${id}`
        })
    }
    else{
        res.json({
            mensaje: 'success',
            data: ({ usuario })
        })
    }
};

export const getUsuarioByMail = async (req:Request ,res:Response) => {

    const { email } = req.body;

    const usuario = await Usuario.findOne({
        where: {
            correo: email
        }
    });

    if( !usuario ){
        res.status(404).json({
            mensaje: `No existe un usuario con el email ${email}`
        })
    }
    else{
        res.json({
            mensaje: 'success',
            data: ({ usuario })
        })
    }
};

export const postUsuario = async (req:Request ,res:Response) => {
    const randomPass = generator.generate({
        length: 15,
        numbers: true
    });
    
    const passwordRandomAsignada = {password: bcrypt.hashSync(randomPass, 10) };

    const {body} = req;
    const postUsuario = {...body, ...passwordRandomAsignada}
        
    if(!body.username || !body.id_perfil || !body.correo) {
        return res.json({
            estado: 'Error: Se debe enviar usuario, id_perfil y mail como mínimo'
        })
    }

    try {
        const existeMail = await Usuario.findOne({
            where: {
                correo: body.correo,
            }
        })

        if(existeMail) {
            return res.status(500).json({
                mensaje: 'Ya existe un usuario con el email ' + body.correo
            })
        }

        else if (body.id_perfil == 5){

            if(!body.nombre || !body.apellido || !body.pais || !body.id_curso) {
                return res.status(500).json({
                    estado: 'Error: Para crear un instructor el nombre, apellido, pais y el id del curso al que se inscribe son datos obligatorios'
                })    
            }

            const usuario = Usuario.build(postUsuario);
            await usuario.save();
            const id_usuario = {id_usuario: usuario.getDataValue('id')};

            const instructor = Instructor.build({...postUsuario, ...id_usuario});
            await instructor.save();
            const id_instructor = {id_instructor: instructor.getDataValue('id')};

            const asignacionCurso = Instructor_Curso.build({...id_instructor, id_curso: body.id_curso})
            await asignacionCurso.save();

            const {HOST, COMPANY_NAME} = process.env;

            const htmlMail = `Hola ${body.nombre}! Ya estas registrado en la plataforma de material en línea.<br><br>
            Dirección Web: {HOST}<br>
            Usuario: <b>${body.username}</b> <br>
            Contraseña: <b>${randomPass}</b><br><br>

            La contraseña de acceso deberá ser cambiada al ingresar por primera vez.<br><br>

            Muchas Gracias.<br>
            Equipo Inscripciones<br>
            {COMPANY_NAME}<br>
            `;

            const asuntoMail = "Alta de usuario";
            
            const emailAInstructor = new Email;
            emailAInstructor.enviarEmail(`${body.correo}`, asuntoMail,'', htmlMail);

            res.json( instructor );
        }

        else{    
            const usuario = Usuario.build(postUsuario);
            await usuario.save();
    
            res.json( usuario );
        }
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const putUsuario = async (req:Request ,res:Response) => {

    const {id} = req.params;
    const {body} = req;

    try {

        const usuario = await Usuario.findByPk( id );
        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + id
            })
        }

        const existeMail = await Usuario.findOne({where: {
            correo: body.correo
        }})

        if(existeMail) {
            return res.status(404).json({
                mensaje: 'No puede asignar un email que ya se encuentra asignado a otro usuario'
            })
        }

        await usuario.update( body );

        await borrarCookies;

        const tokenJwt = Token.getToken({
            id: usuario.getDataValue("id"),
            username: usuario.getDataValue("username"),
            id_perfil: usuario.getDataValue("id_perfil"),
            correo: usuario.getDataValue("correo"),
            habilitado: usuario.getDataValue("habilitado"),
            cambiopass: usuario.getDataValue("cambiopass"),
            acepto_terminos: usuario.getDataValue("acepto_terminos")
        });

        res.cookie('token', tokenJwt, { 
            httpOnly:true,
            sameSite: 'strict'
        });

        res.json( usuario );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }    
};

export const usuarioAceptaTerminos = async (req:Request ,res:Response) => {

    const {idUsuario} = req.params;

    try {

        const usuario = await Usuario.findByPk( idUsuario );
        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + idUsuario
            })
        }

        const aceptaTerminos = {
            acepto_terminos: true
        } 

        await usuario.update( aceptaTerminos );

        const {COMPANY_NAME} = process.env;

        const emailUsuario = usuario.getDataValue('correo');
        const htmlMail = `Gracias por aceptar los nuevos términos y condiciones.<br><br>
            Te deseamos muchos éxitos.<br><br>

            Equipo Inscipciones<br>
            {COMPANY_NAME}<br>
            `;
        const asuntoMail = "Aceptaste los términos y condiciones - {COMPANY_NAME}";
        const emailAInstructor = new Email;
        emailAInstructor.enviarEmail(`${emailUsuario}`, asuntoMail,'', htmlMail);


        await borrarCookies;

        const tokenJwt = Token.getToken({
            id: usuario.getDataValue("id"),
            username: usuario.getDataValue("username"),
            id_perfil: usuario.getDataValue("id_perfil"),
            correo: usuario.getDataValue("correo"),
            habilitado: usuario.getDataValue("habilitado"),
            cambiopass: usuario.getDataValue("cambiopass"),
            acepto_terminos: usuario.getDataValue("acepto_terminos")
        });



        res.cookie('token', tokenJwt, { 
            httpOnly:true,
            sameSite: 'strict'
        });

        res.json( usuario );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }    
};

export const putUsuarioAdmin = async (req:Request ,res:Response) => {

    const {id} = req.params;
    const {body} = req;

    try {
        const usuario = await Usuario.findByPk( id );
        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + id
            })
        }

        const existeMail = await Usuario.findOne({where: {
            correo: body.correo
        }})

        if(existeMail) {
            return res.status(404).json({
                mensaje: 'No puede asignar un email que ya se encuentra asignado a otro usuario'
            })
        }

        await usuario.update( body );

        res.json( usuario );
        
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }    
};

export const reseteoPassUsuario = async (req:Request ,res:Response) => {
    
    const randomPass = generator.generate({
        length: 15,
        numbers: true
    });

    const passwordRandom = {password: bcrypt.hashSync(randomPass, 10)};
    const {id} = req.params;

    try {
        const usuario = await Usuario.findByPk( id );

        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + id
            })
        }
        await usuario.update( {...passwordRandom, cambiopass:false } );

        const nombreUsuario = usuario.getDataValue('username');
        const emailUsuario = usuario.getDataValue('correo');

        const {HOST, COMPANY_NAME} = process.env;

        const htmlMail = `Se ha reseteado tu contraseña correctamente!<br><br>
            A continuación te brindamos los datos de acceso provisorios.<br>
            Recordá que la próxima vez que inicies, tendrás que cambiarla para poder navegar.<br><br>
            Dirección Web: {HOST}<br>
            Usuario: <b>${nombreUsuario}</b> <br>
            Contraseña: <b>${randomPass}</b><br><br>

            Muchas Gracias.<br>
            Equipo Inscipciones<br>
            {COMPANY_NAME}<br>
            `;
        const asuntoMail = "Reseteo de password";    
        const emailAInstructor = new Email;
        emailAInstructor.enviarEmail(`${emailUsuario}`, asuntoMail,'', htmlMail);

        
        res.json( usuario );
        
    } catch (error) {
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }

};

export const cambioPassUsuario = async (req:Request ,res:Response) => {
    
    const { idUsuario } = req.params;
    const { body } = req;

    try {
        const usuario = await Usuario.findByPk( idUsuario );

        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + idUsuario
            })
        }

        if(!body.password1 || !body.password2){
            return res.status(500).json({
                mensaje: 'Tenes que mandar las dos password'
            })
        }
        else if ( body.password1 !== body.password2 ){
            return res.status(500).json({
                mensaje: 'Las password no coinciden'
            })
        }

        await usuario.update( {password: bcrypt.hashSync(body.password1, 10) , cambiopass: true} );

        const {COMPANY_NAME} = process.env;
        
        const emailUsuario = usuario.getDataValue('correo');
        const htmlMail = `Tu contraseña se ha cambiado correctamente!<br><br>
            Muchas Gracias.<br>
            Equipo Inscipciones<br>
            {COMPANY_NAME}<br>
            `;
        const asuntoMail = "Cambio de password";    
        const emailAInstructor = new Email;
        emailAInstructor.enviarEmail(`${emailUsuario}`, asuntoMail,'', htmlMail);

        await borrarCookies;

        const tokenJwt = Token.getToken({
            id: usuario.getDataValue("id"),
            username: usuario.getDataValue("username"),
            id_perfil: usuario.getDataValue("id_perfil"),
            correo: usuario.getDataValue("correo"),
            habilitado: usuario.getDataValue("habilitado"),
            cambiopass: usuario.getDataValue("cambiopass"),
            acepto_terminos: usuario.getDataValue("acepto_terminos")
        })

        res.cookie('token', tokenJwt, { 
            httpOnly:true,
            sameSite: 'strict'
        });

        res.json( usuario );
        
    } catch (error) { 
        res.status(500).json({
            mensaje: 'Hable con el administrador',
        })
    }
};

export const deleteUsuario = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const usuario = await Usuario.findByPk( id );

        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + id
            })
        }
        //ELIMINAR EL USUARIO
        await usuario.destroy();
        res.json({
            mensaje: 'El usuario ha sido borrado con éxito!'
        })

};

export const inhabilitarUsuario = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const usuario = await Usuario.findByPk( id );

        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + id
            })
        } 
        //INHABILITAR USUARIO 
        await usuario.update({ habilitado: false })
        res.json(usuario)

};

export const habilitarUsuario = async (req:Request ,res:Response) => {

    const {id} = req.params;

    const usuario = await Usuario.findByPk( id );

        if(!usuario){
            return res.status(404).json({
                mensaje: 'No existe un usuario con el id ' + id
            })
        } 
         
        await usuario.update({ habilitado: true })
        res.json(usuario)

};

//LOGIN
export const loginUsuario = async (req:Request ,res:Response) => {

    const {username, password} = req.body;

    if(!username || !password){
        return res.status(500).json({
            estado: 'error',
            mensaje: 'Se debe enviar usuario y password para el login'
        })
    }

    const usuario = await Usuario.findOne({where:{
        username: username,
    }})
    
    if(!usuario){
        return res.status(404).json({
            estado: 'error',
            mensaje: 'Usuario no encontrado en base de datos'
        })
    }

    const compararPassword = () => {
        if ( bcrypt.compareSync( password, usuario.getDataValue('password') )){
            return true
        }
        else{
            return false
        }
    }

    if( !compararPassword() ){
        return res.status(500).json({
            estado: 'error',
            mensaje: 'La password enviada no es correcta'
        })
    }

    else {
        const tokenJwt = Token.getToken({
            id: usuario.getDataValue("id"),
            username: usuario.getDataValue("username"),
            id_perfil: usuario.getDataValue("id_perfil"),
            correo: usuario.getDataValue("correo"),
            habilitado: usuario.getDataValue("habilitado"),
            cambiopass: usuario.getDataValue("cambiopass"),
            acepto_terminos: usuario.getDataValue("acepto_terminos")
        })

        res.cookie('token', tokenJwt, { 
            httpOnly:true,
            sameSite: 'strict'
        });

        return res.json({
            estado: 'success',
            data: usuario
        })
    }   
}


