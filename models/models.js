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
TokenModel.hasOne(UserModel)

module.exports = {
    UserModel, 
    TokenModel
}