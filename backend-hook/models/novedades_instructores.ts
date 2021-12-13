import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Novedades_instructores = db.define('novedades_instructores', {
    path_imagen: {
        type: DataTypes.STRING 
    },
    path_destino: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    habilitado: {
        type: DataTypes.BOOLEAN
    }
}, 
{
    tableName:'novedades_instructores',
    createdAt:false,
    updatedAt:false,
});

export default Novedades_instructores;