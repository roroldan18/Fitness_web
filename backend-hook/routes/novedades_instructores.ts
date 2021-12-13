import { Router } from 'express';
import { deleteNovedad, deshabilitarNovedad, getNovedad, getNovedades, postNovedad, putNovedad, habilitarNovedad, getNovedadesActivas } from '../controllers/novedades_instructores';
import { validarAdmin, validarHabilitado, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';


const novedades_instructoresRoutes= Router();

novedades_instructoresRoutes.use( verificarToken );
novedades_instructoresRoutes.use( validarHabilitado );
novedades_instructoresRoutes.use( limiter );


// ENDPOINTS
novedades_instructoresRoutes.get('/activas/',             getNovedadesActivas);

novedades_instructoresRoutes.use( validarAdmin );

novedades_instructoresRoutes.get('/:id',                  getNovedad);
novedades_instructoresRoutes.get('/',                     getNovedades);
novedades_instructoresRoutes.post('/',                    postNovedad);
novedades_instructoresRoutes.put('/:id',                  putNovedad);
novedades_instructoresRoutes.put('/deshabilitar/:id',     deshabilitarNovedad);
novedades_instructoresRoutes.put('/habilitar/:id',        habilitarNovedad);
novedades_instructoresRoutes.delete('/:id',               deleteNovedad);

export default novedades_instructoresRoutes;