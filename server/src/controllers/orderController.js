import prisma from '../config/database.js';
import catchAsyncErrors from '../middlewares/catchAsyncError.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';

// Create New Order
export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderItems, shippingInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || !shippingInfo || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
    return next(new ErrorHandler('Please provide all required fields', 400));
  }

  // Create order with related data using transaction
  const order = await prisma.$transaction(async (prisma) => {
    // Create order
    const newOrder = await prisma.order.create({
      data: {
        userId: req.user.id,
        itemsPrice: parseFloat(itemsPrice),
        taxPrice: parseFloat(taxPrice),
        shippingPrice: parseFloat(shippingPrice),
        totalPrice: parseFloat(totalPrice),
        orderStatus: 'Processing',
        paidAt: paymentInfo ? new Date() : null,
      },
    });

    // Create shipping info
    await prisma.shippingInfo.create({
      data: {
        orderId: newOrder.id,
        fullName: shippingInfo.fullName || req.user.name,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country || 'India',
        pincode: shippingInfo.pincode,
        phone: shippingInfo.phone,
      },
    });

    // Create payment info if provided
    if (paymentInfo) {
      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          paymentId: paymentInfo.id || null,
          paymentStatus: paymentInfo.status === 'succeeded' ? 'Paid' : 'Pending',
          paymentMethod: paymentInfo.method || 'card',
          transactionId: paymentInfo.id || null,
        },
      });
    }

    // Create order items and update stock
    for (const item of orderItems) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.product,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image: item.image,
        },
      });

      // Update product stock
      await prisma.product.update({
        where: { id: item.product },
        data: {
          stock: {
            decrement: parseInt(item.quantity),
          },
        },
      });
    }

    // Return order with all related data
    return await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        orderItems: true,
        shippingInfo: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  });

  res.status(201).json({
    success: true,
    order,
    message: 'Order created successfully',
  });
});

// Get Single Order
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, images: true },
          },
        },
      },
      shippingInfo: true,
      payment: true,
    },
  });

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if user is authorized to view this order
  if (order.userId !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorHandler('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get My Orders
export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, images: true },
          },
        },
      },
      shippingInfo: true,
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders (Admin)
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, images: true },
          },
        },
      },
      shippingInfo: true,
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status (Admin)
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(orderStatus)) {
    return next(new ErrorHandler('Invalid order status', 400));
  }

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // If cancelling order, restore stock
  if (orderStatus === 'Cancelled') {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: id },
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
  }

  const updateData = { orderStatus };
  if (orderStatus === 'Delivered') {
    updateData.deliveredAt = new Date();
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      orderItems: true,
      shippingInfo: true,
      payment: true,
    },
  });

  res.status(200).json({
    success: true,
    order: updatedOrder,
    message: 'Order status updated successfully',
  });
});

// Delete Order (Admin)
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Delete order items first
  await prisma.orderItem.deleteMany({
    where: { orderId: id },
  });

  // Delete shipping info
  await prisma.shippingInfo.deleteMany({
    where: { orderId: id },
  });

  // Delete payment info
  await prisma.payment.deleteMany({
    where: { orderId: id },
  });

  // Delete order
  await prisma.order.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
  });
});

export default {
  createOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};

