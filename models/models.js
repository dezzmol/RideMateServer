const sequelize = require("../db")
const { DataTypes } = require("sequelize")

const UserModel = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING },
})

const TokenModel = sequelize.define("token", {
    refreshToken: { type: DataTypes.STRING },
})

UserModel.hasOne(TokenModel)
TokenModel.belongsTo(UserModel)

const PasswordChangeCodeModel = sequelize.define("passwordChangeCode", {
    changeCode: { type: DataTypes.STRING },
})

UserModel.hasOne(PasswordChangeCodeModel)
PasswordChangeCodeModel.belongsTo(UserModel)

const EmailChangeCodeModel = sequelize.define("emailChangeCode", {
    changeCode: { type: DataTypes.STRING },
})

UserModel.hasOne(EmailChangeCodeModel)
EmailChangeCodeModel.belongsTo(UserModel)

const PasswordRecoveryCodeModel = sequelize.define("passwordRecoveryCode", {
    recoveryCode: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
})

const CarModel = sequelize.define("car", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    model: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    mileage: { type: DataTypes.INTEGER, allowNull: false },
    fuelConsumption: { type: DataTypes.DOUBLE, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },

    // Поле означающее будет ли отображена машина в общем списке всех авто. При true будет, при false нет
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
})

const BrandModel = sequelize.define("brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

const ClassModel = sequelize.define("class", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

BrandModel.hasMany(CarModel)
CarModel.belongsTo(BrandModel)

ClassModel.hasMany(CarModel)
CarModel.belongsTo(ClassModel)

const UserHistoryModel = sequelize.define("userHistory", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    carId: {
        type: DataTypes.INTEGER,
        references: { model: CarModel, key: "id" },
    },
    occupied_dates: {
        type: DataTypes.ARRAY(DataTypes.DATEONLY),
    },
    totalPrice: { type: DataTypes.DOUBLE, allowNull: false },
})

UserModel.hasOne(UserHistoryModel)
UserHistoryModel.belongsTo(UserModel)

module.exports = {
    UserModel,
    TokenModel,
    PasswordChangeCodeModel,
    EmailChangeCodeModel,
    PasswordRecoveryCodeModel,
    CarModel,
    BrandModel,
    ClassModel,
    UserHistoryModel,
}
