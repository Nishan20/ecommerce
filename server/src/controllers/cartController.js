import prisma from "../config/database.js";
import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";

// Get cart items for the current user
export const getCart = catchAsyncErrors(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  res.status(200).json({
    success: true,
    cart: cartItems,
  });
});

// Add or update an item in the cart
export const addToCart = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required.", 400));
  }

  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.max(1, quantity) },
    });
    return res.status(200).json({ success: true, cartItem: updated });
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      quantity: Math.max(1, quantity),
    },
  });

  res.status(201).json({ success: true, cartItem });
});

// Update cart item quantity
export const updateCartItem = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItem = await prisma.cartItem.findUnique({ where: { id } });
  if (!cartItem || cartItem.userId !== userId) {
    return next(new ErrorHandler("Cart item not found.", 404));
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity: Math.max(1, quantity) },
  });

  res.status(200).json({ success: true, cartItem: updated });
});

// Remove an item from the cart
export const removeCartItem = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const cartItem = await prisma.cartItem.findUnique({ where: { id } });
  if (!cartItem || cartItem.userId !== userId) {
    return next(new ErrorHandler("Cart item not found.", 404));
  }

  await prisma.cartItem.delete({ where: { id } });
  res.status(200).json({ success: true, message: "Item removed from cart." });
});

// Clear cart for user
export const clearCart = catchAsyncErrors(async (req, res) => {
  const userId = req.user.id;
  await prisma.cartItem.deleteMany({ where: { userId } });
  res.status(200).json({ success: true, message: "Cart cleared." });
});
