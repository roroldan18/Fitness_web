import { Router } from 'express';
import { deleteMaterial, getMaterial, getMateriales, getMaterialesPorCurso, postMaterial, putMaterial, habilitarMaterial, getMaterialesAdminPorCurso } from '../controllers/material';
import { validarAdmin, validarHabilitado, validarIdWithGet, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';

const materialesRoutes = Router();

materialesRoutes.use ( verificarToken );
materialesRoutes.use ( validarHabilitado );
materialesRoutes.use ( limiter );

// ENDPOINTS
materialesRoutes.get('/curso/:idCurso',            getMaterialesPorCurso);

materialesRoutes.use( validarAdmin );

materialesRoutes.get('/admin/curso/:idCurso', getMaterialesAdminPorCurso);
materialesRoutes.get('/:id',                  getMaterial);
materialesRoutes.get('/',                     getMateriales);
materialesRoutes.post('/',                    postMaterial);
materialesRoutes.put('/:id',                  putMaterial);
materialesRoutes.put('/habilitar/:id',        habilitarMaterial);
materialesRoutes.delete('/:id',               deleteMaterial);

export default materialesRoutes;