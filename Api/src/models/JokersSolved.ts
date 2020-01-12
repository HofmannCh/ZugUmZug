import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class JokerSolved extends Model { }
JokerSolved.init({
  Id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Points: {
    type: DataType.INTEGER,
    allowNull: false,
    field: 'Points'
  },
  GroupId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'Id'
    },
    field: 'GroupId'
  },
  JokerId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Jokers',
      key: 'Id'
    },
    field: 'JokerId'
  }
}, {
  sequelize: db,
  tableName: 'JokersSolved'
});
export default JokerSolved
