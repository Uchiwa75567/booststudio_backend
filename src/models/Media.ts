import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../server';

export interface MediaAttributes {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
  category?: string;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Media extends Model<MediaAttributes> implements MediaAttributes {
  public id!: string;
  public type!: 'image' | 'video';
  public url!: string;
  public title?: string;
  public description?: string;
  public category?: string;
  public isVisible!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Media.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Media',
    tableName: 'media',
    timestamps: true,
  }
);