import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../server';

export interface ReservationAttributes {
  id: string;
  fullName: string;
  phone: string;
  serviceType: 'studio' | 'clip_video' | 'photographie' | 'evenement';
  location: 'studio' | 'exterieur' | 'domicile';
  duration: number;
  dateTime: string;
  comments?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation extends Model<ReservationAttributes> implements ReservationAttributes {
  public id!: string;
  public fullName!: string;
  public phone!: string;
  public serviceType!: 'studio' | 'clip_video' | 'photographie' | 'evenement';
  public location!: 'studio' | 'exterieur' | 'domicile';
  public duration!: number;
  public dateTime!: string;
  public comments?: string;
  public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM('studio', 'clip_video', 'photographie', 'evenement'),
      allowNull: false,
    },
    location: {
      type: DataTypes.ENUM('studio', 'exterieur', 'domicile'),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true,
  }
);