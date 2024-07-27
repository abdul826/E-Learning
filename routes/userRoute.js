import express from "express";
import { register,verifyUser,loginUser, myProfile } from "../controller/userController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post('/register', register);
router.post('/verifyuser', verifyUser);
router.post('/login', loginUser);
router.get('/me', isAuth, myProfile);


export default router;