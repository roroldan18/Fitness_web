import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Usuario = db.define('usuario', {
    username: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING 
    },
    id_perfil: {
        type: DataTypes.NUMBER
    },
    correo: {
        type: DataTypes.STRING 
    },
    habilitado: {
        type: DataTypes.BOOLEAN
    },
    cambiopass: {
        type: DataTypes.BOOLEAN
    },
    acepto_terminos: {
        type: DataTypes.BOOLEAN
    }
}, 
{
    tableName:'usuario',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
},
);

export default Usuario;