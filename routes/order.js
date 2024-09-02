import { Router } from "express";
import {
  createOrder,
  orderConfirmation,
  addItemCart,
  deleteItem,
  sendOrder,
  orderHistory,
  getCart,
} from "../controllers/orderController.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Get cart
router.get("/getCart/:orderId", getCart);

// Adds item to cart
router.put("/addItemCart/:orderId", addItemCart);

// Create order
router.post("/createOrder", createOrder);

// Remove item from cart
router.delete("/deleteItem/:orderId", deleteItem);

// Get order confirmation
router.get("/orderConfirmation/:orderId", orderConfirmation);

// Complete order
router.post("/sendOrder/:orderId", sendOrder);

// Order history and authentication
router.get("/orderHistory/:userId", authenticate, orderHistory);

export default router;
