import { Router } from 'express';
import { deleteInstructor, getInstructor, getInstructores, getInstructorPorUsuario, putInstructor } from '../controllers/instructores';
import { validarAdmin, validarHabilitado, validarIdInstructorWithGet, validarIdWithGet, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';

const instructoresRoutes = Router();

instructoresRoutes.use ( verificarToken );
instructoresRoutes.use ( validarHabilitado );
instructoresRoutes.use ( limiter );


// ENDPOINTS 
instructoresRoutes.get('/:idInstructorParams',                  validarIdInstructorWithGet, getInstructor);
instructoresRoutes.get('/usuario/:idUsuario',                   validarIdWithGet,           getInstructorPorUsuario);
instructoresRoutes.put('/:idInstructorParams',                  validarIdInstructorWithGet, putInstructor);

instructoresRoutes.use( validarAdmin );

instructoresRoutes.get('/admin/usuario/:idUsuario',             getInstructorPorUsuario);
instructoresRoutes.get('/',                                     getInstructores);
instructoresRoutes.delete('/:idInstructorParams',               deleteInstructor);

export default instructoresRoutes;