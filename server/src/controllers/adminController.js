import prisma from '../config/database.js';
import catchAsyncErrors from '../middlewares/catchAsyncError.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';

// Get all users (Admin)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'User' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        lastLoginDevice: true,
        lastLoginIp: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({
      where: { role: 'User' },
    }),
  ]);

  res.status(200).json({
    success: true,
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});

// Delete user (Admin)
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Prevent deleting admin users
  if (user.role === 'Admin') {
    return next(new ErrorHandler('Cannot delete admin users', 400));
  }

  await prisma.user.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// Get dashboard stats (Admin)
export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
  // Total Users Count
  const totalUsers = await prisma.user.count({
    where: { role: 'User' },
  });

  // Total Products Count
  const totalProducts = await prisma.product.count();

  // Total Orders Count
  const totalOrders = await prisma.order.count();

  // Total Revenue (from paid orders)
  const revenueResult = await prisma.order.aggregate({
    where: {
      payment: {
        paymentStatus: 'Paid',
      },
    },
    _sum: {
      totalPrice: true,
    },
  });
  const totalRevenue = revenueResult._sum.totalPrice || 0;

  // Order status counts
  const orderStatusCounts = await prisma.order.groupBy({
    by: ['orderStatus'],
    _count: {
      orderStatus: true,
    },
  });

  const statusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orderStatusCounts.forEach((status) => {
    statusCounts[status.orderStatus] = status._count.orderStatus;
  });

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  // Recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      orderStatusCounts: statusCounts,
    },
    recentOrders,
    recentUsers,
    message: 'Dashboard Stats Fetched Successfully',
  });
});

// Get single user (Admin)
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pincode: true,
      createdAt: true,
      lastLoginDevice: true,
      lastLoginIp: true,
      lastLoginLocation: true,
      orders: {
        select: {
          id: true,
          totalPrice: true,
          orderStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user role (Admin)
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['User', 'Admin'].includes(role)) {
    return next(new ErrorHandler('Invalid role', 400));
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: 'User role updated successfully',
  });
});

export default {
  getAllUsers,
  deleteUser,
  dashboardStats,
  getSingleUser,
  updateUserRole,
};

