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
exports.getChartData = exports.getInventories = exports.calculatePercentage = exports.reduceStock = exports.invalidateCache = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const product_1 = require("../models/product");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const atlasConnectionUri = "mongodb+srv://abhi:abhi007@cluster0.gct2pwc.mongodb.net/";
        yield mongoose_1.default.connect(atlasConnectionUri, {
            dbName: 'Ecommerce_24', // Change this to your desired database name
        });
        console.log('DB Connected to', mongoose_1.default.connection.host);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
exports.connectDB = connectDB;
const invalidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        app_1.myCache.del(productKeys);
    }
    if (order) {
        const ordersKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        app_1.myCache.del(ordersKeys);
    }
    if (admin) {
        app_1.myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};
exports.invalidateCache = invalidateCache;
const reduceStock = (orderItems) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = yield product_1.Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        yield product.save();
    }
});
exports.reduceStock = reduceStock;
const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
exports.calculatePercentage = calculatePercentage;
const getInventories = ({ categories, productsCount, }) => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesCountPromise = categories.map((category) => product_1.Product.countDocuments({ category }));
    const categoriesCount = yield Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
});
exports.getInventories = getInventories;
const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
exports.getChartData = getChartData;
