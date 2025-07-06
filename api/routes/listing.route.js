import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifiedUser.js";
import { deleteListing } from "../controllers/listing.controller.js";
import { updateListing } from "../controllers/listing.controller.js";
import { getListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing)

export default router;