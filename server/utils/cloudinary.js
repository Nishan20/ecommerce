import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config({ path: './config/config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder = 'ecommerce') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

export default cloudinary;

