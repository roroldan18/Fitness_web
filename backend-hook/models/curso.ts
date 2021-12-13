import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Curso = db.define('curso', {
    nombre: {
        type: DataTypes.STRING 
    },
    sigla: {
        type: DataTypes.STRING 
    },
    descripcion: {
        type: DataTypes.STRING
    },
    activo: {
        type: DataTypes.BOOLEAN
    }
}, 
{
    tableName:'curso',
    createdAt:'created_at',
    updatedAt:'updated_at'

});

export default Curso;