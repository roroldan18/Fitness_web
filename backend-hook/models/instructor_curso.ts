import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Instructor_Curso = db.define('instructor_curso', {
    id_instructor: {
        type: DataTypes.UUID,
        primaryKey:true
    },
    id_curso: {
        type: DataTypes.UUID
    }
}, 
{
    tableName:'instructor_curso',
    createdAt:'created_at',
    updatedAt: false,
});

export default Instructor_Curso;