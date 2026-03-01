import { config } from "dotenv";
// Load from the server folder structure
config({ path: "./server/config/config.env" });

import pkg from "pg";
const { Client } = pkg;

const dbUser = process.env.DB_USER || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'mern_ecommerce_store';
const dbPassword = process.env.DB_PASSWORD || '';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

export const database = new Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
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
