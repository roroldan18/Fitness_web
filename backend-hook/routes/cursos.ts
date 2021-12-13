import { Router } from 'express';
import { getCursos, getCurso, postCurso, putCurso, deleteCurso, habilitarCurso, getCursoUsuario } from '../controllers/cursos';
import { validarAdmin, validarHabilitado, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';

const cursosRoutes = Router();

cursosRoutes.use( verificarToken );
cursosRoutes.use( validarHabilitado );

// ENDPOINTS 
cursosRoutes.get('/:idCurso',  limiter,   getCursoUsuario);


cursosRoutes.use( validarAdmin );
cursosRoutes.get('/admin/:id',            getCurso);
cursosRoutes.get('/',                     getCursos);
cursosRoutes.post('/',                    postCurso);
cursosRoutes.put('/:id',                  putCurso);
cursosRoutes.delete('/:id',               deleteCurso);
cursosRoutes.put('/habilitar/:id',        habilitarCurso);

export default cursosRoutes;