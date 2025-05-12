
import Router from 'express-promise-router';
import UserController from '../controllers/user.js';
import * as validators from '../common/validators.js';
import passport from 'passport';
import '../passport.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = Router();
const authenticate = (strategy) =>
  passport.authenticate(`${strategy}`, { session: false });

router.route("/signup").post(UserController.signUp);

router.route("/signin").post(authenticate("local"), UserController.signIn);

router.route("/users").get(isAuth, UserController.getUserIsLogin);

router
  .route("/google")
  .post(authenticate("googleToken"), UserController.signIn);

router
  .route("/facebook")
  .post(authenticate("facebookToken"), UserController.signIn);

router.post("/forgot-password", validators.validate("forgotPassWord"), validators.validationMiddleware, UserController.forgotPassword);
router.post("/reset-password", validators.validate("resetPassWord"), validators.validationMiddleware, UserController.resetPassword);

export default router;