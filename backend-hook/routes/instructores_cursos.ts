import { Router } from 'express';
import { getInstructoresConCursos, getWithInstructor, getWithCurso, postInstructor, deleteAsignacion } from '../controllers/instructores_cursos';
import { validarAdmin, validarHabilitado, validarIdInstructorWithGet, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';

const instructores_cursosRoutes = Router();

instructores_cursosRoutes.use( verificarToken );
instructores_cursosRoutes.use( validarHabilitado );


// ENDPOINTS
instructores_cursosRoutes.get('/instructor/:idInstructorParams',    limiter,validarIdInstructorWithGet,     getWithInstructor);

instructores_cursosRoutes.use( validarAdmin );

instructores_cursosRoutes.get('/curso/:id',                                                         getWithCurso);
instructores_cursosRoutes.delete('/instructor/admin/:idInstructorParams/:idCurso',      deleteAsignacion);
instructores_cursosRoutes.post('/',                                                     postInstructor);
instructores_cursosRoutes.get('/instructor/admin/:idInstructorParams',                  getWithInstructor);
instructores_cursosRoutes.get('/',                                                      getInstructoresConCursos);

export default instructores_cursosRoutes;