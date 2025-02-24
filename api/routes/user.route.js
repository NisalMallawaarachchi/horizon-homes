import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

// Define your routes here
router.get("/", test);

export default router;