import prisma from './src/config/database.js';

async function addSampleProducts() {
  try {
    const products = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 199.99,
        stock: 50,
        category: {
          name: "Electronics",
          slug: "electronics"
        },
        images: ["https://via.placeholder.com/400x400?text=Headphones"]
      },
      {
        name: "Smart Watch Series 5",
        description: "Advanced smartwatch with health monitoring, GPS, and water resistance.",
        price: 299.99,
        stock: 30,
        category: {
          name: "Electronics",
          slug: "electronics"
        },
        images: ["https://via.placeholder.com/400x400?text=Smart+Watch"]
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt available in multiple colors.",
        price: 19.99,
        stock: 100,
        category: {
          name: "Clothing",
          slug: "clothing"
        },
        images: ["https://via.placeholder.com/400x400?text=T-Shirt"]
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with advanced cushioning technology.",
        price: 89.99,
        stock: 75,
        category: {
          name: "Sports",
          slug: "sports"
        },
        images: ["https://via.placeholder.com/400x400?text=Running+Shoes"]
      }
    ];

    for (const productData of products) {
      // Create or find category
      let category = await prisma.category.findUnique({
        where: { slug: productData.category.slug }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: productData.category.name,
            slug: productData.category.slug
          }
        });
      }

      // Create product
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
    }

    console.log("Sample products added successfully!");
  } catch (error) {
    console.error("Error adding sample products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProducts();