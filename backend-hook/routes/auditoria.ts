import { Router } from 'express';
import { auditoriaPost } from '../controllers/auditoria';

const auditoriaRoutes = Router();

// ENDPOINTS 
auditoriaRoutes.post('/',        auditoriaPost);

export default auditoriaRoutes;