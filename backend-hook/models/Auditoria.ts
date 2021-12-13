import { DataTypes }from 'sequelize';
import db from '../bin/connectionMySql';

const Auditoria = db.define('auditoria', {
    id_usuario: {
        type: DataTypes.STRING 
    }
}, 
{
    tableName:'auditoria_intentosInhabilitados',
    createdAt: 'fecha_modificacion',
    updatedAt: false,
});

export default Auditoria;