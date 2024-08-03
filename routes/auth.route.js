const router = require("express").Router();
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const authGuard = require("../guards/auth.guard");
const authController = require("../controllers/auth.controller");
const garageModel = require("../models/garages.model");
const userModel = require("../models/user.model");

router.get("/Subscription-plans", authGuard.isAuth, authController.getSubscriptionPlans);

router.post("/plan-a", authGuard.isAuth, bodyParser.urlencoded({ extended: true }), userModel.postPlanA);

router.post("/plan-b", authGuard.isAuth, bodyParser.urlencoded({ extended: true }), userModel.postPlanB);

router.post("/plan-c", authGuard.isAuth, bodyParser.urlencoded({ extended: true }), userModel.postPlanC);

router.post("/resetPlan", authGuard.isAuth, bodyParser.urlencoded({ extended: true }), userModel.postResetPlan);

router.get("/forgetPassword-enterOTP", authGuard.notAuth, authController.getForgetPasswordEnterOTP);

router.post("/forgetPassword", authGuard.notAuth, bodyParser.urlencoded({ extended: true }), authController.postForgetPassword);

router.post("/resetPassword", authGuard.notAuth, bodyParser.urlencoded({ extended: true }), authController.postResetPassword);

router.get("/confirmEmail", authGuard.notAuth, authController.getConfirmEmail);

router.post("/confirmEmail", authGuard.notAuth, bodyParser.urlencoded({ extended: false }), authController.postConfirmEmail);

router.get("/Receive-Your-Car", garageModel.getReceiveYourCar);

router.post("/receiveYourCar", bodyParser.urlencoded({ extended: true }), garageModel.postReceiveYourCar);

router.get("/login-signup", authGuard.notAuth, authController.getLoginSignup);

router.post("/signup",authGuard.notAuth,bodyParser.urlencoded({ extended: true }),check("username").not().isEmpty().withMessage("Username is required"),check("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),check("confirmPassword").custom((value, { req }) => {
        if (value === req.body.password) return true;
        else throw "Passwords do not match";}),authController.postSignup);

router.post("/login", authGuard.notAuth, bodyParser.urlencoded({ extended: true }), check("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"), authController.postLogin);

router.get("/parkyLoginSignup", authGuard.notAuth, authController.getParkeyLoginSignup);

router.post("/parkySignup",authGuard.notAuth,bodyParser.urlencoded({ extended: true }),check("username").not().isEmpty().withMessage("Username is required"),check("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),check("confirmPassword").custom((value, { req }) => {
        if (value === req.body.password) return true;
        else throw "Passwords do not match";}),authController.postSignup);

router.post("/parkyLogin", authGuard.notAuth, bodyParser.urlencoded({ extended: true }), check("email").not().isEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"), authController.postParkeyLogin);

router.all("/logout", authGuard.isUserAndAdmin, authController.logout);

module.exports = router;
