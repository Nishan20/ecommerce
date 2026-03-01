import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteProductReview,
  getAllProducts,
  getProductReviews,
  getSingleProduct,
  updateProduct,
  createProductReview,
} from "../controllers/productController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Public routes
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);
router.get("/products/:id/reviews", getProductReviews);

// Protected routes - User
router.post("/products/:id/review", isAuthenticated, createProductReview);

// Protected routes - Admin
router.post(
  "/products",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct
);
router.put(
  "/products/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateProduct
);
router.delete(
  "/products/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct
);
router.delete(
  "/reviews/:reviewId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProductReview
);

export default router;
