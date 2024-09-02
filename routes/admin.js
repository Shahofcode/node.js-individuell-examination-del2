import { Router } from "express";
import { addProduct, updateProduct, deleteProduct, addCampaignOffer } from "../controllers/adminController.js";
import adminMiddleware from "../middleware/admin.js";

const router = Router();

router.use("/", adminMiddleware);

router.post("/product/add", addProduct);
router.patch("/product/update", updateProduct);
router.delete("/product/delete/:productId", deleteProduct);

router.post("/campaignOffer/add", addCampaignOffer);

export default router;