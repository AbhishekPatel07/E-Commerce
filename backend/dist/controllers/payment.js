"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.allCoupons = exports.applyDiscount = exports.newCoupon = exports.createPaymentIntent = void 0;
const app_js_1 = require("../app.js");
const error_js_1 = require("../middlewares/error.js");
const coupon_js_1 = require("../models/coupon.js");
const utility_class_js_1 = __importDefault(require("../utils/utility-class.js"));
exports.createPaymentIntent = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    if (!amount)
        return next(new utility_class_js_1.default("Please enter amount", 400));
    const paymentIntent = yield app_js_1.stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
}));
exports.newCoupon = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new utility_class_js_1.default("Please enter both coupon and amount", 400));
    yield coupon_js_1.Coupon.create({ code: coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} Created Successfully`,
    });
}));
exports.applyDiscount = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon } = req.query;
    const discount = yield coupon_js_1.Coupon.findOne({ code: coupon });
    if (!discount)
        return next(new utility_class_js_1.default("Invalid Coupon Code", 400));
    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
}));
exports.allCoupons = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupon_js_1.Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
}));
exports.deleteCoupon = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const coupon = yield coupon_js_1.Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new utility_class_js_1.default("Invalid Coupon ID", 400));
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Deleted Successfully`,
    });
}));
