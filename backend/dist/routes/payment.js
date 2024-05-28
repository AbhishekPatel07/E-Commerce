"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_js_1 = require("../controllers/payment.js");
const app = express_1.default.Router();
// route - /api/v1/payment/create
app.post("/create", payment_js_1.createPaymentIntent);
// // route - /api/v1/payment/coupon/new
app.get("/discount", payment_js_1.applyDiscount);
// // route - /api/v1/payment/coupon/new
app.post("/coupon/new", payment_js_1.newCoupon);
// // route - /api/v1/payment/coupon/all
app.get("/coupon/all", payment_js_1.allCoupons);
// // route - /api/v1/payment/coupon/:id
app.delete("/coupon/:id", payment_js_1.deleteCoupon);
exports.default = app;
