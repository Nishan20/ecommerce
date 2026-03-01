import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncerror.js";
import database from "../database/db.js";

// Create New Order
export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderItems, shippingInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || !shippingInfo || !paymentInfo || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
    return next(ErrorHandler("Please provide all required fields", 400));
  }

  // Create order
  const order = await database.query(
    `INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price, order_status, paid_at) 
     VALUES ($1, $2, $3, $4, $5, NOW()) 
     RETURNING *`,
    [req.user.id, totalPrice, taxPrice, shippingPrice, "Processing"]
  );

  const orderId = order.rows[0].id;

  // Create shipping info
  await database.query(
    `INSERT INTO shipping_info (order_id, full_name, address, city, state, country, pincode, phone) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [orderId, shippingInfo.fullName || req.user.name, shippingInfo.address, shippingInfo.city, shippingInfo.state, shippingInfo.country, shippingInfo.pincode, shippingInfo.phone]
  );

  // Create payment info
  await database.query(
    `INSERT INTO payments (order_id, payment_id, payment_status, payment_method) 
     VALUES ($1, $2, $3, $4)`,
    [orderId, paymentInfo.id, paymentInfo.status, paymentInfo.method]
  );

  // Create order items
  for (const item of orderItems) {
    await database.query(
      `INSERT INTO order_items (order_id, product_id, name, price, quantity, image) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, item.product, item.name, item.price, item.quantity, item.image]
    );

    // Update product stock
    await database.query(
      "UPDATE products SET stock = stock - $1 WHERE id = $2",
      [item.quantity, item.product]
    );
  }

  res.status(201).json({
    success: true,
    order: order.rows[0],
    message: "Order created successfully",
  });
});

// Get Single Order
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await database.query(
    `SELECT o.*, u.name as user_name, u.email as user_email,
            s.full_name, s.address, s.city, s.state, s.country, s.pincode, s.phone,
            p.payment_id, p.payment_status, p.payment_method
     FROM orders o
     JOIN users u ON o.buyer_id = u.id
     LEFT JOIN shipping_info s ON o.id = s.order_id
     LEFT JOIN payments p ON o.id = p.order_id
     WHERE o.id = $1`,
    [id]
  );

  if (order.rows.length === 0) {
    return next(ErrorHandler("Order not found", 404));
  }

  // Check if user is authorized to view this order
  if (order.rows[0].buyer_id !== req.user.id && req.user.role !== "Admin") {
    return next(ErrorHandler("Not authorized to view this order", 403));
  }

  // Get order items
  const orderItems = await database.query(
    `SELECT * FROM order_items WHERE order_id = $1`,
    [id]
  );

  res.status(200).json({
    success: true,
    order: {
      ...order.rows[0],
      orderItems: orderItems.rows,
    },
  });
});

// Get My Orders
export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await database.query(
    `SELECT o.*, 
            s.full_name, s.address, s.city, s.state, s.country, s.pincode, s.phone
     FROM orders o
     LEFT JOIN shipping_info s ON o.id = s.order_id
     WHERE o.buyer_id = $1
     ORDER BY o.created_at DESC`,
    [req.user.id]
  );

  // Get order items for each order
  const ordersWithItems = await Promise.all(
    orders.rows.map(async (order) => {
      const orderItems = await database.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      return { ...order, orderItems: orderItems.rows };
    })
  );

  res.status(200).json({
    success: true,
    orders: ordersWithItems,
  });
});

// Get All Orders (Admin)
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await database.query(
    `SELECT o.*, u.name as user_name, u.email as user_email
     FROM orders o
     JOIN users u ON o.buyer_id = u.id
     ORDER BY o.created_at DESC`
  );

  // Get order items for each order
  const ordersWithItems = await Promise.all(
    orders.rows.map(async (order) => {
      const orderItems = await database.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      return { ...order, orderItems: orderItems.rows };
    })
  );

  let totalAmount = 0;
  orders.rows.forEach((order) => {
    totalAmount += parseFloat(order.total_price);
  });

  res.status(200).json({
    success: true,
    orders: ordersWithItems,
    totalAmount,
  });
});

// Update Order Status (Admin)
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(orderStatus)) {
    return next(ErrorHandler("Invalid order status", 400));
  }

  const order = await database.query("SELECT * FROM orders WHERE id = $1", [id]);

  if (order.rows.length === 0) {
    return next(ErrorHandler("Order not found", 404));
  }

  // If cancelling order, restore stock
  if (orderStatus === "Cancelled") {
    const orderItems = await database.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [id]
    );

    for (const item of orderItems.rows) {
      await database.query(
        "UPDATE products SET stock = stock + $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }
  }

  const updatedOrder = await database.query(
    "UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *",
    [orderStatus, id]
  );

  res.status(200).json({
    success: true,
    order: updatedOrder.rows[0],
    message: "Order status updated successfully",
  });
});

// Delete Order (Admin)
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const order = await database.query("SELECT * FROM orders WHERE id = $1", [id]);

  if (order.rows.length === 0) {
    return next(ErrorHandler("Order not found", 404));
  }

  // Delete order items first
  await database.query("DELETE FROM order_items WHERE order_id = $1", [id]);

  // Delete shipping info
  await database.query("DELETE FROM shipping_info WHERE order_id = $1", [id]);

  // Delete payment info
  await database.query("DELETE FROM payments WHERE order_id = $1", [id]);

  // Delete order
  await database.query("DELETE FROM orders WHERE id = $1", [id]);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
