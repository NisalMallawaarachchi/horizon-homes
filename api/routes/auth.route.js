import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const router = express.Router();

<<<<<<< HEAD
router.post('/signup', signup);
router.post('/signin', signin);
=======
router.post("/signup", signup);
router.post("/signin", signin);
>>>>>>> 73cf0d507a63f04eacf14a069f4612959dad38ab

export default router;
