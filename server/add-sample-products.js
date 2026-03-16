import prisma from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function addSampleProducts() {
  try {


    const products = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 199.99,
        stock: 50,
        category: "electronics",
        images: ["https://images.unsplash.com/photo-1518441902110-9dff7f6a97f1?w=400&h=400&fit=crop"]
      },
      {
        name: "Smart Watch Series 5",
        description: "Advanced smartwatch with health monitoring, GPS, and water resistance.",
        price: 299.99,
        stock: 30,
        category: "electronics",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"]
      },
      {
        name: "Gaming Laptop",
        description: "Powerful gaming laptop with RTX graphics and high refresh rate display.",
        price: 1499.99,
        stock: 15,
        category: "electronics",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"]
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt available in multiple colors.",
        price: 19.99,
        stock: 100,
        category: "fashion",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"]
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with advanced cushioning technology.",
        price: 89.99,
        stock: 75,
        category: "fashion",
        images: ["https://images.unsplash.com/photo-1528701800489-20be3c1d3c6c?w=400&h=400&fit=crop"]
      },
      {
        name: "Leather Jacket",
        description: "Premium leather jacket with inner lining and multiple pockets.",
        price: 249.99,
        stock: 25,
        category: "fashion",
        images: ["https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=400&fit=crop"]
      },
      {
        name: "Coffee Maker",
        description: "Automatic drip coffee maker with programmable timer.",
        price: 49.99,
        stock: 40,
        category: "home",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"]
      },
      {
        name: "Ergonomic Office Chair",
        description: "Comfortable ergonomic chair with adjustable height and lumbar support.",
        price: 299.99,
        stock: 20,
        category: "home",
        images: ["https://images.unsplash.com/photo-1582582494700-39e9f7c8a6e6?w=400&h=400&fit=crop"]
      },
      {
        name: "Modern Floor Lamp",
        description: "Stylish floor lamp with dimmable lighting and adjustable height.",
        price: 129.99,
        stock: 35,
        category: "home",
        images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop"]
      },
      {
        name: "Organic Basmati Rice",
        description: "Premium organic basmati rice, 5kg pack.",
        price: 24.99,
        stock: 80,
        category: "grocery",
        images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"]
      },
      {
        name: "Fresh Almond Milk",
        description: "Organic almond milk, 1L carton.",
        price: 4.99,
        stock: 120,
        category: "grocery",
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop"]
      },
      {
        name: "Mixed Nuts Trail Mix",
        description: "Healthy trail mix with almonds, cashews, raisins, and dried cranberries.",
        price: 12.99,
        stock: 60,
        category: "grocery",
        images: ["https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop"]
      }
    ];

    let createdCount = 0;
    let updatedCount = 0;

    for (const productData of products) {
      const categorySlug = productData.category;
      let category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
            slug: categorySlug
          }
        });
      }

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { name: productData.name }
      });

      if (existingProduct) {
        // Update images
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            images: productData.images
          }
        });
        updatedCount++;
      } else {
        // Create new
        await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock: productData.stock,
            categoryId: category.id,
            images: productData.images
          }
        });
        createdCount++;
      }
    }


  } catch (error) {
    console.error("❌ Error during seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProducts();
