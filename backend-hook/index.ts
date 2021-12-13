import Server from './class/server';
import bodyParser from 'body-parser';
import userRoutes from './routes/users';
import cors from 'cors';
import {dbConnection} from './bin/connectionMySql';
import cursosRoutes from './routes/cursos';
import instructoresRoutes from './routes/instructores';
import Instructor from './models/instructor';
import Usuario from './models/user';
import instructores_cursosRoutes from './routes/instructores_cursos';
import Instructor_Curso from './models/instructor_curso';
import Curso from './models/curso';
import materialesRoutes from './routes/material';
import instructores_materialesRoutes from './routes/instructores_material';
import Instructor_Material from './models/instructor_material';
import Material from './models/material';
import material_detalleRoutes from './routes/material_detalle';
import Material_detalle from './models/material_detalle';
import novedades_instructoresRoutes from './routes/novedades_instructores';
import cookieParser from 'cookie-parser';
import validarTokenRoutes from './routes/validarToken';
import auditoriaRoutes from './routes/auditoria';
import helmet from 'helmet';

export const logger = require('./utils/logger');

//Creando servidor web
const server = new Server();

//Inicio el servidor
server.start(() => {
    logger.info(`Servidor corriendo en puerto ${server.puerto} y en host ${server.host}`)
});

//Uso de Helmet para seguridad
server.app.use(helmet());

//Uso de Cookies
server.app.use(cookieParser());

//Incorporo el Body Parser
server.app.use(bodyParser.json());
server.app.use(bodyParser.urlencoded({extended:true}));

//Uso el CORS
server.app.use( cors() );

//Conexion --> FORMA FERNANDO HERRERA
dbConnection();


// RUTAS APLICACION

server.app.use('/users',                        userRoutes);
server.app.use('/cursos',                       cursosRoutes);
server.app.use('/instructores',                 instructoresRoutes);
server.app.use('/instructores_cursos',          instructores_cursosRoutes);
server.app.use('/instructores_material',        instructores_materialesRoutes);
server.app.use('/materiales',                   materialesRoutes);
server.app.use('/materiales_detalle',           material_detalleRoutes);
server.app.use('/novedades_instructores',       novedades_instructoresRoutes);
server.app.use('/jwt',                          validarTokenRoutes);
server.app.use('/auditoria',                    auditoriaRoutes);



// RELACIONES


Usuario.hasMany(Instructor, {foreignKey: 'id_usuario'})
Instructor.belongsTo(Usuario, {foreignKey: 'id_usuario'})

Curso.hasMany(Material, {foreignKey: 'id_curso'})
Material.belongsTo(Curso, {foreignKey: 'id_curso'})



Instructor.hasMany(Instructor_Curso, {foreignKey: 'id_instructor'})
Curso.hasMany(Instructor_Curso, {foreignKey: 'id_curso'})
Instructor_Curso.belongsTo(Instructor, {foreignKey: 'id_instructor'})
Instructor_Curso.belongsTo(Curso, {foreignKey: 'id_curso'})


Instructor.hasMany(Instructor_Material, {foreignKey: 'id_instructor'})
Material.hasMany(Instructor_Material, {foreignKey: 'id_material'})
Instructor_Material.belongsTo(Instructor, {foreignKey: 'id_instructor'})
Instructor_Material.belongsTo(Material, {foreignKey: 'id_material'})


Material.hasMany(Material_detalle, {foreignKey: 'id_material'})
Material_detalle.belongsTo(Material, {foreignKey: 'id_material'})

