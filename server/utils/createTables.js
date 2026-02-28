import { createUserTable } from "../models/userTable.js";
import { createOrderItemTable } from "../models/orderItemsTable.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createPaymentsTable } from "../models/paymentstable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { createProductsTable } from "../models/productTable.js";
import { createShippingInfoTable } from "../models/shippinginfoTable.js";

export const createTables = async () => {
  console.log("createTables started...");

  try {
    // 1. Independent tables first
    await createUserTable();
    console.log("User table done");

    await createProductsTable();
    console.log("Products table done");

    // 2. Orders table (needed by shipping_info and payments)
    await createOrdersTable();
    console.log("Orders table done");

    // 3. Tables that depend on orders
    await createShippingInfoTable();
    console.log("Shipping table done");

    await createPaymentsTable();
    console.log("Payments table done");

    // 4. Order items (depends on orders and products)
    await createOrderItemTable();
    console.log("OrderItem table done");

    // 5. Reviews (depends on users and products)
    await createProductReviewsTable();
    console.log("Reviews table done");

    console.log("All Tables Created Successfully.");
  } catch (error) {
    console.error("Error Creating Tables:", error);
  }
};
