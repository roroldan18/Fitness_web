import { Router } from 'express';
import { cambioPassUsuario, deleteUsuario, getFilteredUsuarios, getUsuario, usuarioAceptaTerminos, getUsuarioByMail, getUsuarios, habilitarUsuario, inhabilitarUsuario, loginUsuario, postUsuario, putUsuario, putUsuarioAdmin, reseteoPassUsuario } from '../controllers/users';
import { validarAdmin, validarHabilitado, validarIdWithGet, verificarToken } from '../middlewares/authentication';
import { limiter, limiterLogin } from '../middlewares/limiter';

const userRoutes = Router();

userRoutes.post('/user/login',          limiterLogin,loginUsuario);
userRoutes.post('/user/email',          getUsuarioByMail);
userRoutes.put('/reseteoPass/:id',      reseteoPassUsuario);

userRoutes.use( verificarToken );
userRoutes.use( validarHabilitado );
userRoutes.use( limiter );



userRoutes.get('/:idUsuario',               validarIdWithGet,                getUsuario);
userRoutes.put('/:idUsuario',               validarIdWithGet,                putUsuario);
userRoutes.put('/terminos/:idUsuario',      validarIdWithGet,                usuarioAceptaTerminos);
userRoutes.put('/cambioPass/:idUsuario',    validarIdWithGet,                cambioPassUsuario);

userRoutes.use( validarAdmin );

userRoutes.put('/admin/:id',            putUsuarioAdmin);
userRoutes.get('/admin/:id',            getUsuario);
userRoutes.post('/withFilter',          getFilteredUsuarios);
userRoutes.get('/',                     getUsuarios);
userRoutes.delete('/inhabilitar/:id',   inhabilitarUsuario);
userRoutes.put('/habilitar/:id',        habilitarUsuario);
userRoutes.delete('/:id',               deleteUsuario);
userRoutes.post('/',                    postUsuario);

export default userRoutes;