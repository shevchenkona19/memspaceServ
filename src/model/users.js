module.exports = (db, DataTypes) => {
    const Users = db.define("users", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING
        },
        imageData: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        accessLvl: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        favorites: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        }
    });

    return Users;
};