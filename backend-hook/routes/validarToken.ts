import { Router } from 'express';
import { borrarCookies, validarToken } from '../controllers/token';
import { verificarToken } from '../middlewares/authentication';

//Creo una variable para almacenarle todos los metodos de Router.- 
const validarTokenRoutes = Router();

validarTokenRoutes.get('/',                                 validarToken);
validarTokenRoutes.get('/removeCookies', verificarToken,    borrarCookies);

export default validarTokenRoutes;