import { Router } from 'express';
import { asignarMaterialAInstructor, getInstructoresConMixes, getInstructoresWithMixes, getMixesWithInstructor, getMixesWithInstructorDetalle, getNoInstructoresWithMixes, quitarAsignacionDeMaterial } from '../controllers/instructores_material';
import { validarAdmin, validarHabilitado, validarIdInstructorWithGet, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';

const instructores_materialesRoutes = Router();

instructores_materialesRoutes.use( verificarToken );
instructores_materialesRoutes.use( validarHabilitado );

// ENDPOINTS 
instructores_materialesRoutes.get('/instructor/:idInstructorParams/:idCurso',             limiter,validarIdInstructorWithGet,   getMixesWithInstructor);
instructores_materialesRoutes.get('/instructor/detalle/:idInstructorParams/:idCurso',     limiter,validarIdInstructorWithGet,   getMixesWithInstructorDetalle);


instructores_materialesRoutes.use( validarAdmin );

instructores_materialesRoutes.get('/material/admin/:idMaterial',                                getInstructoresWithMixes);
instructores_materialesRoutes.get('/material/admin/:idCurso/:idMaterial',                       getNoInstructoresWithMixes);
instructores_materialesRoutes.get('/admin/instructor/:idInstructorParams/:idCurso',             getMixesWithInstructor);
instructores_materialesRoutes.get('/admin/instructor/detalle/:idInstructorParams/:idCurso',     getMixesWithInstructorDetalle);
instructores_materialesRoutes.get('/',                                                          getInstructoresConMixes);
instructores_materialesRoutes.post('/instructor/:idInstructorParams',                           asignarMaterialAInstructor);
instructores_materialesRoutes.delete('/:idInstructor/:idMaterial',                              quitarAsignacionDeMaterial);


export default instructores_materialesRoutes;