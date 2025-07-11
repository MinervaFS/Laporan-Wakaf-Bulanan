// lib/config/connect-db.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false, // matikan log query (bisa true kalau ingin debug)
  }
);

export default sequelize;
