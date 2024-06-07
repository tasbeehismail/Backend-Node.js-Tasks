import { Router } from "express";
const router = Router();
import * as userController from "./controller/user.js";

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/:user_id', userController.getUser);

export default router;
