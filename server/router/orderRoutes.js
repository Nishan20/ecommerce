import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Protected routes - User
router.post("/order/new", isAuthenticated, createOrder);
router.get("/orders/my", isAuthenticated, getMyOrders);
router.get("/orders/:id", isAuthenticated, getSingleOrder);

// Protected routes - Admin
router.get(
  "/admin/orders",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllOrders
);
router.put(
  "/admin/orders/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateOrderStatus
);
router.delete(
  "/admin/orders/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteOrder
);

export default router;
