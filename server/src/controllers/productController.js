import prisma from '../config/database.js';
import catchAsyncErrors from '../middlewares/catchAsyncError.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Get all products with search, filter, pagination
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const { category, minPrice, maxPrice, ratings, search, page = 1, limit = 12, sort = 'newest' } = req.query;

  const where = {};
  
  // Search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Category filter (using slug)
  if (category) {
    where.category = { slug: category };
  }

  // Price filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Ratings filter
  if (ratings) {
    where.ratings = { gte: parseFloat(ratings) };
  }

  // Sorting
  let orderBy = {};
  switch (sort) {
    case 'price-low':
      orderBy = { price: 'asc' };
      break;
    case 'price-high':
      orderBy = { price: 'desc' };
      break;
    case 'popular':
      orderBy = { numOfReviews: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip,
      take: parseInt(limit),
    }),
    prisma.product.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    products,
    totalProducts: total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// Get single product
export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Create product (Admin)
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, categoryId, stock } = req.body;

  if (!name || !description || !price || !categoryId) {
    return next(new ErrorHandler('Please provide all required fields.', 400));
  }

  // Handle image uploads
  let images = [];
  if (req.files && req.files.images) {
    const imageFiles = Array.isArray(req.files.images) 
      ? req.files.images 
      : [req.files.images];

    for (const file of imageFiles) {
      const result = await uploadToCloudinary(file.tempFilePath, 'products');
      images.push(result.url);
    }
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return next(new ErrorHandler('Category not found.', 404));
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      categoryId,
      stock: parseInt(stock) || 0,
      images,
    },
    include: {
      category: true,
    },
  });

  res.status(201).json({
    success: true,
    product,
    message: 'Product created successfully.',
  });
});

// Update product (Admin)
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, categoryId, stock } = req.body;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price) updateData.price = parseFloat(price);
  if (categoryId) updateData.categoryId = categoryId;
  if (stock !== undefined) updateData.stock = parseInt(stock);

  // Handle new image uploads
  if (req.files && req.files.images) {
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file of imageFiles) {
      const result = await uploadToCloudinary(file.tempFilePath, 'products');
      updateData.images = [...product.images, result.url];
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
    },
  });

  res.status(200).json({
    success: true,
    product: updatedProduct,
    message: 'Product updated successfully.',
  });
});

// Delete product (Admin)
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  // Delete images from Cloudinary
  for (const imageUrl of product.images) {
    try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`products/${publicId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  await prisma.product.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully.',
  });
});

// Get all categories
export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.status(200).json({
    success: true,
    categories,
  });
});

// Create category (Admin)
export const createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return next(new ErrorHandler('Please provide category name.', 400));
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  // Check if category already exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    return next(new ErrorHandler('Category already exists.', 400));
  }

  // Handle image upload
  let image = null;
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(req.files.image.tempFilePath, 'categories');
    image = result.url;
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      image,
    },
  });

  res.status(201).json({
    success: true,
    category,
    message: 'Category created successfully.',
  });
});

// Update category (Admin)
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    return next(new ErrorHandler('Category not found.', 404));
  }

  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  if (description) updateData.description = description;

  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(req.files.image.tempFilePath, 'categories');
    updateData.image = result.url;
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    category: updatedCategory,
    message: 'Category updated successfully.',
  });
});

// Delete category (Admin)
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!category) {
    return next(new ErrorHandler('Category not found.', 404));
  }

  if (category.products.length > 0) {
    return next(new ErrorHandler('Cannot delete category with products.', 400));
  }

  await prisma.category.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully.',
  });
});

// Get product reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    reviews,
  });
});

// Create product review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!rating || !productId) {
    return next(new ErrorHandler('Please provide rating and product ID.', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new ErrorHandler('Rating must be between 1 and 5.', 400));
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  // Check if user already reviewed
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: req.user.id,
      productId,
    },
  });

  if (existingReview) {
    return next(new ErrorHandler('You have already reviewed this product.', 400));
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      rating: parseInt(rating),
      comment,
      userId: req.user.id,
      productId,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  // Update product ratings
  const reviews = await prisma.review.findMany({
    where: { productId },
  });

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratings: avgRating,
      numOfReviews: reviews.length,
    },
  });

  res.status(201).json({
    success: true,
    review,
    message: 'Review added successfully.',
  });
});

// Delete product review (Admin)
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    return next(new ErrorHandler('Review not found.', 404));
  }

  await prisma.review.delete({ where: { id } });

  // Update product ratings
  const reviews = await prisma.review.findMany({
    where: { productId: review.productId },
  });

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await prisma.product.update({
      where: { id: review.productId },
      data: {
        ratings: avgRating,
        numOfReviews: reviews.length,
      },
    });
  } else {
    await prisma.product.update({
      where: { id: review.productId },
      data: {
        ratings: 0,
        numOfReviews: 0,
      },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully.',
  });
});

export default {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductReviews,
  createProductReview,
  deleteProductReview,
};

