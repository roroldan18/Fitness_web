import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Material_detalle = db.define('material_detalle', {
    id_material: {
        type: DataTypes.UUID 
    },
    descripcion: {
        type: DataTypes.STRING 
    },
    estilo: {
        type: DataTypes.STRING
    },
    path: {
        type: DataTypes.STRING
    },
    tipo_material: {
        type: DataTypes.STRING
    },
    path_video: {
        type: DataTypes.STRING
    },
    orden: {
        type: DataTypes.NUMBER
    }
}, 
{
    tableName:'material_detalle',
    updatedAt: false,
    createdAt: false,
});

export default Material_detalle;