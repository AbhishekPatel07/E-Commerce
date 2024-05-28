"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = exports.errorMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Internal error");
    err.statusCode || (err.statusCode = 500);
    if (err.name === "CastError")
        err.message = "Invalid ID";
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.errorMiddleware = errorMiddleware;
const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
exports.TryCatch = TryCatch;
