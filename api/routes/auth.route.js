import express from "express";
import { signup, signin, googleAuth, signOut } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleAuth);
router.get('/signout', signOut);

export default router;
