import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Material = db.define('material', {
    descripcion: {
        type: DataTypes.STRING 
    },
    activo: {
        type: DataTypes.BOOLEAN 
    },
    id_curso: {
        type: DataTypes.UUID
    },
    imagen_path: {
        type: DataTypes.STRING
    },
}, 
{
    tableName:'material',
    createdAt:'fecha_creacion',
    updatedAt: false
});

export default Material;