import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Instructor_Material = db.define('instructor_material', {
    id_instructor: {
        type: DataTypes.UUID,
        primaryKey:true
    },
    id_material: {
        type: DataTypes.UUID
    }
}, 
{
    tableName:'instructor_material',
    createdAt: 'fecha',
    updatedAt: false,
});

export default Instructor_Material;