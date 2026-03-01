import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncerror.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

// Get All Products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const { category, price, ratings, search, page = 1, limit = 10 } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (price) {
    query += ` AND price <= $${paramIndex}`;
    params.push(price);
    paramIndex++;
  }

  if (ratings) {
    query += ` AND ratings >= $${paramIndex}`;
    params.push(ratings);
    paramIndex++;
  }

  // Count total products
  const countQuery = query.replace("SELECT *", "SELECT COUNT(*)");
  const totalResult = await database.query(countQuery, params);
  const totalProducts = parseInt(totalResult.rows[0].count);

  // Add pagination
  const offset = (page - 1) * limit;
  query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(parseInt(limit), offset);

  const products = await database.query(query, params);

  res.status(200).json({
    success: true,
    products: products.rows,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: parseInt(page),
  });
});

// Get Single Product
export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await database.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  if (product.rows.length === 0) {
    return next(ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product: product.rows[0],
  });
});

// Create Product (Admin only)
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    return next(ErrorHandler("Please provide all required fields", 400));
  }

  let images = [];
  if (req.files && req.files.images) {
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of imageFiles) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Ecommerce_Products",
        width: 800,
        crop: "scale",
      });
      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  const product = await database.query(
    "INSERT INTO products (name, description, price, category, stock, images, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      name,
      description,
      stock,
      JSON.stringify(images),
      category,
      req.user.id,
    ]
  );

  res.status(201).json({
    success: true,
    product: product.rows[0],
    message: "Product created successfully",
  });
});

// Update Product (Admin only)
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  let product = await database.query("SELECT * FROM products WHERE id = $1", [
    id,
  ]);

  if (product.rows.length === 0) {
    return next(ErrorHandler("Product not found", 404));
  }

  let images = product.rows[0].images;

  if (req.files && req.files.images) {
    // Delete old images from cloudinary
    if (images && images.length > 0) {
      for (const image of images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    // Upload new images
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    images = [];

    for (const image of imageFiles) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Ecommerce_Products",
        width: 800,
        crop: "scale",
      });
      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  const updatedProduct = await database.query(
    "UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5, images = $6 WHERE id = $7 RETURNING *",
    [name, description, price, category, stock, JSON.stringify(images), id]
  );

  res.status(200).json({
    success: true,
    product: updatedProduct.rows[0],
    message: "Product updated successfully",
  });
});

// Delete Product (Admin only)
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    id,
  ]);

  if (product.rows.length === 0) {
    return next(ErrorHandler("Product not found", 404));
  }

  // Delete images from cloudinary
  if (product.rows[0].images && product.rows[0].images.length > 0) {
    for (const image of product.rows[0].images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  await database.query("DELETE FROM products WHERE id = $1", [id]);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Get Product Reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const reviews = await database.query(
    `SELECT r.*, u.name, u.avatar 
     FROM reviews r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.product_id = $1 
     ORDER BY r.created_at DESC`,
    [id]
  );

  res.status(200).json({
    success: true,
    reviews: reviews.rows,
  });
});

// Create Product Review
export const createProductReview = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return next(
        ErrorHandler("Please provide rating and comment", 400)
      );
    }

    if (rating < 1 || rating > 5) {
      return next(ErrorHandler("Rating must be between 1 and 5", 400));
    }

    // Check if user already reviewed
    const existingReview = await database.query(
      "SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (existingReview.rows.length > 0) {
      return next(
        ErrorHandler("You have already reviewed this product", 400)
      );
    }

    // Create review
    const review = await database.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, req.user.id, rating, comment]
    );

    // Update product average rating
    const avgRating = await database.query(
      "SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = $1",
      [id]
    );

    await database.query("UPDATE products SET ratings = $1 WHERE id = $2", [
      avgRating.rows[0].avg_rating,
      id,
    ]);

    res.status(201).json({
      success: true,
      review: review.rows[0],
      message: "Review created successfully",
    });
  }
);

// Delete Product Review (Admin only)
export const deleteProductReview = catchAsyncErrors(
  async (req, res, next) => {
    const { reviewId } = req.params;

    const review = await database.query(
      "SELECT * FROM reviews WHERE id = $1",
      [reviewId]
    );

    if (review.rows.length === 0) {
      return next(ErrorHandler("Review not found", 404));
    }

    const productId = review.rows[0].product_id;

    await database.query("DELETE FROM reviews WHERE id = $1", [
      reviewId,
    ]);

    // Update product average rating
    const avgRating = await database.query(
      "SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = $1",
      [productId]
    );

    const newRating = avgRating.rows[0].avg_rating || 0;

    await database.query("UPDATE products SET ratings = $1 WHERE id = $2", [
      newRating,
      productId,
    ]);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  }
);
