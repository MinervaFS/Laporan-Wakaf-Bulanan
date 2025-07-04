import mysql from "mysql2/promise";

let pool;

export const connectMySQL = async () => {
  try {
    if (pool) {
      console.log("✅ Database MySQL already connected");
      return pool;
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Test connection
    await pool.getConnection();
    console.log("✅ DB MySQL connected successfully");

    return pool;
  } catch (error) {
    console.error("❌ MySQL connection error:", error.message);
    throw new Error("Failed to connect to MySQL");
  }
};
