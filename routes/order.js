import { Router } from "express";
import {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  orderHistory,
  getOrder,
} from "../controllers/orderController.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Hämta varukorg
router.get("/getOrder/:orderId", getOrder);

// Ändra varukorg
router.put("/changeOrder", changeOrder);

// Skapa order
router.post("/createOrder", createOrder);

// Töm varukorg
router.delete("/deleteItem", deleteItem);

// Orderstatus
router.get("/createOrder/orderStatus/:orderId", getOrderStatus);

// Slutföra order
router.post("/completeOrder/:orderId", completeOrder);

// Orderhistorik
router.get("/orderHistory/:userId", authenticate, orderHistory);

export default router;
