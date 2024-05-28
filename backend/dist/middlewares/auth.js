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
exports.adminOnly = void 0;
const user_js_1 = require("../models/user.js");
const utility_class_js_1 = __importDefault(require("../utils/utility-class.js"));
const error_js_1 = require("./error.js");
// Middleware to make sure only admin is allowed
exports.adminOnly = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id)
        return next(new utility_class_js_1.default(" Login Karo phle", 401));
    const user = yield user_js_1.User.findById(id);
    if (!user)
        return next(new utility_class_js_1.default("Please Enter Real ID ", 401));
    if (user.role !== "admin")
        return next(new utility_class_js_1.default("Access by admin only", 403));
    next();
}));
