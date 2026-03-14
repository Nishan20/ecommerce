import express from "express";
import {
  createOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new order
router.post("/", isAuthenticated, createOrder);

// Get my orders
router.get("/my-orders", isAuthenticated, getMyOrders);

// Get single order
router.get("/:id", isAuthenticated, getSingleOrder);

// Get all orders (Admin)
router.get(
  "/all-orders",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllOrders
);

// Update order status (Admin)
router.put(
  "/:id/status",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderStatus
);

// Delete order (Admin)
router.delete(
  "/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteOrder
);

export default router;

