import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductReview,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductReviews,
  createProductReview,
} from "../controllers/productController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/:id", getSingleProduct);
router.get("/:productId/reviews", getProductReviews);

// Protected routes - User
router.post("/:id/review", isAuthenticated, createProductReview);

// Protected routes - Admin
router.post(
  "/",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct
);
router.put(
  "/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateProduct
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct
);

// Category routes - Admin
router.post(
  "/categories",
  isAuthenticated,
  authorizedRoles("Admin"),
  createCategory
);
router.put(
  "/categories/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateCategory
);
router.delete(
  "/categories/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteCategory
);

// Review routes - Admin
router.delete(
  "/reviews/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProductReview
);

export default router;

