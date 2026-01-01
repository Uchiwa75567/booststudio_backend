"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const sequelize_1 = require("sequelize");
const server_1 = require("../server");
class Reservation extends sequelize_1.Model {
}
exports.Reservation = Reservation;
Reservation.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    serviceType: {
        type: sequelize_1.DataTypes.ENUM('studio', 'clip_video', 'photographie', 'evenement'),
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.ENUM('studio', 'exterieur', 'domicile'),
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    dateTime: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    comments: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    sequelize: server_1.sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true,
});
