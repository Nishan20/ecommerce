import express from "express";
import {
  getAllUsers,
  deleteUser,
  dashboardStats,
  getSingleUser,
  updateUserRole,
} from "../controllers/adminController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Dashboard
router.get(
  "/dashboard-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats
);

// User management
router.get(
  "/users",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers
);

router.get(
  "/users/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  getSingleUser
);

router.put(
  "/users/:id/role",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateUserRole
);

router.delete(
  "/users/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteUser
);

export default router;

