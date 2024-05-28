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
exports.deleteOrder = exports.processOrder = exports.getSingleOrder = exports.allOrders = exports.myOrders = exports.newOrder = void 0;
const error_1 = require("../middlewares/error");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const app_1 = require("../app");
const features_1 = require("../utils/features");
const features_2 = require("../utils/features");
const order_1 = require("../models/order");
exports.newOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
        return next(new utility_class_1.default("Please Enter All Fields", 400));
    const order = yield order_1.Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    yield (0, features_2.reduceStock)(orderItems);
    (0, features_1.invalidateCache)({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((i) => String(i.productId)),
    });
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
}));
exports.myOrders = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user } = req.query;
    const key = `my-orders-${user}`;
    let orders = [];
    if (app_1.myCache.has(key))
        orders = JSON.parse(app_1.myCache.get(key));
    else {
        orders = yield order_1.Order.find({ user });
        app_1.myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
}));
exports.allOrders = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `all-orders`;
    let orders = [];
    if (app_1.myCache.has(key))
        orders = JSON.parse(app_1.myCache.get(key));
    else {
        orders = yield order_1.Order.find().populate("user", "name");
        app_1.myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
}));
exports.getSingleOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;
    if (app_1.myCache.has(key))
        order = JSON.parse(app_1.myCache.get(key));
    else {
        order = yield order_1.Order.findById(id).populate("user", "name");
        if (!order)
            return next(new utility_class_1.default("Order Not Found", 404));
        app_1.myCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
}));
exports.processOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_1.Order.findById(id);
    if (!order)
        return next(new utility_class_1.default("Order Not Found", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    yield order.save();
    (0, features_1.invalidateCache)({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(200).json({
        success: true,
        message: "Order Processed Successfully",
    });
}));
exports.deleteOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_1.Order.findById(id);
    if (!order)
        return next(new utility_class_1.default("Order Not Found", 404));
    yield order.deleteOne();
    (0, features_1.invalidateCache)({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully",
    });
}));
