import pkg from "pg";
const { Client } = pkg;

export const database = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const connectDB = async () => {
  try {
    await database.connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default database;