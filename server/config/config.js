const dotenv = require("dotenv");

if (process.env.NODE_ENV === "production") {
  console.log('dotenv - product')
  dotenv.config({ path: __dirname + "/../.env.production" });
} else {
  console.log('dotenv - develop')
  dotenv.config({ path: __dirname + "/../.env.development" });
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "coldbrewcode",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
    timezone: "+09:00",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "coldbrewcode",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
    timezone: "+09:00",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "coldbrewcode",
    host: "coldbrewcode-db.endia.me",
    port: "33306",
    dialect: "mysql",
    timezone: "+09:00",
  },
};
