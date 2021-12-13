import { Sequelize } from 'sequelize';
import variables_entorno from '../config';
 
const db = new Sequelize(
    variables_entorno.DB_MYSQL,
    variables_entorno.DB_USERNAME,
    variables_entorno.DB_PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'mysql'
    })

export const dbConnection = async ()  => {
    try {
        await db.authenticate();
        console.log('Aplicacion conectada a base de datos MySQL')
    } catch (error:any) {
        throw new Error ( error );
    }
}

export default db;