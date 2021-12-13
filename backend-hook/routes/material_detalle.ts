import { Router } from 'express';
import { crearDetalle, deleteMaterialDetalle, getMaterialDetalle, getMaterialDetallePorID, getMaterialPorIDMaterial, putMaterialDetalle, getMaterialInstructorPorIdMaterial } from '../controllers/material_detalle';
import { validarAdmin, validarHabilitado, validarIdInstructorWithGet, verificarToken } from '../middlewares/authentication';
import { limiter } from '../middlewares/limiter';

const material_detalleRoutes = Router();

material_detalleRoutes.use ( verificarToken );
material_detalleRoutes.use ( validarHabilitado );
material_detalleRoutes.use ( limiter );

// ENDPOINTS 


material_detalleRoutes.get('/material/:idInstructorParams/:idMix',  validarIdInstructorWithGet,  getMaterialInstructorPorIdMaterial);

material_detalleRoutes.use( validarAdmin );

material_detalleRoutes.get('/:id',               getMaterialDetallePorID);
material_detalleRoutes.get('/material/:id',      getMaterialPorIDMaterial);
material_detalleRoutes.get('/',                  getMaterialDetalle);
material_detalleRoutes.put('/:id',               putMaterialDetalle);
material_detalleRoutes.post('/',                 crearDetalle);
material_detalleRoutes.delete('/:id',            deleteMaterialDetalle); 

export default material_detalleRoutes;