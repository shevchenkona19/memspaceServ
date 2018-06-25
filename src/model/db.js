const Sequelize = require("sequelize");
console.log("DB_URL: ", process.env.DATABASE_URL);
console.log("ENV: ", process.env);
const sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports = {sequelize, Sequelize};