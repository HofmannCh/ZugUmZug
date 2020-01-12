import {Table, Column, Model, HasMany, DataType} from 'sequelize-typescript';
import db from "@lib/database"

@Table
class User extends Model { }
User.init({
    Id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'Id'
    },
    UserName: {
      type: DataType.STRING(20),
      allowNull: false,
      field: 'UserName'
    },
    PasswordHash: {
      type: DataType.STRING(64),
      allowNull: false,
      field: 'PasswordHash'
    },
    Roles: {
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'Roles'
    }
  }, {
    sequelize: db,
    tableName: 'Users'
  });
export default User
