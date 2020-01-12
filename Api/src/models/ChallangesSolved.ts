import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import db from "@lib/database"

@Table
class ChallangeSolved extends Model { }
ChallangeSolved.init({
  Id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Valid: {
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'Valid'
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
  ChallangeId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'Challanges',
      key: 'Id'
    },
    field: 'ChallangeId'
  },
  UserId: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'Id'
    },
    field: 'UserId'
  }
}, {
  sequelize: db,
  tableName: 'ChallangesSolved'
});
export default ChallangeSolved