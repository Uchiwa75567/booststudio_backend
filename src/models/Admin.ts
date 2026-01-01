import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../server';

export interface AdminAttributes {
  id: string;
  username: string;
  password: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Admin extends Model<AdminAttributes> implements AdminAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public lastLogin?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: true,
  }
);