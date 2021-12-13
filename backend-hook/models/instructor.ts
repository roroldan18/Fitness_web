import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Instructor = db.define('instructor', {
    id_usuario: {
        type: DataTypes.UUID 
    },
    nombre: {
        type: DataTypes.STRING 
    },
    apellido: {
        type: DataTypes.STRING
    },
    fecha_nacimiento: {
        type: DataTypes.DATE
    },
    direccion: {
        type: DataTypes.STRING
    },
    id_zona: {
        type: DataTypes.NUMBER
    },
    telefono: {
        type: DataTypes.NUMBER
    },
    sexo: {
        type: DataTypes.STRING
    },
    perfil_fb: {
        type: DataTypes.STRING
    },
    perfil_instagram: {
        type: DataTypes.STRING
    },
    pais: {
        type: DataTypes.STRING
    },
    provincia: {
        type: DataTypes.STRING
    },
    ciudad: {
        type: DataTypes.STRING
    },
    fuerza_completa_datos: {
        type: DataTypes.BOOLEAN
    }
}, 
{
    tableName:'instructor',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Instructor;