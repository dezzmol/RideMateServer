const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const UserModel = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    name: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING}
})

const TokenModel = sequelize.define('token', {
    refreshToken: {type: DataTypes.STRING}
})

UserModel.hasOne(TokenModel)
TokenModel.belongsTo(UserModel)

const CarModel = sequelize.define('car', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    model: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    mileage: {type: DataTypes.INTEGER, allowNull: false},
    lastMileageOnTS: {type: DataTypes.INTEGER, defaultValue: 0},
    fuelConsumption: {type: DataTypes.DOUBLE, allowNull: false},
    //0 - rentalParking, 1 - maintenanceParking
    technicalCondition: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false}
})

const BrandModel = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const ClassModel = sequelize.define('class', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

BrandModel.hasMany(CarModel)
CarModel.belongsTo(BrandModel)

ClassModel.hasMany(CarModel)
CarModel.belongsTo(ClassModel)

module.exports = {
    UserModel, 
    TokenModel,
    CarModel,
    BrandModel,
    ClassModel
}