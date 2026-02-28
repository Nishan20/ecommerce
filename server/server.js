import { config } from "dotenv";
config({ path: "./config/config.env" }); // MUST BE FIRST

import app from "./app.js";
import cloudinary from "cloudinary";
import { connectDB } from "./database/db.js";
import { createTables } from "./utils/createTables.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await connectDB();
  await createTables();
});