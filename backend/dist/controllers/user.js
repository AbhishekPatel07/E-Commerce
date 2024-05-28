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
exports.deleteUser = exports.getUser = exports.getAllUsers = exports.newUser = void 0;
const user_js_1 = require("../models/user.js");
const moment_1 = __importDefault(require("moment"));
const utility_class_js_1 = __importDefault(require("../utils/utility-class.js"));
const error_js_1 = require("../middlewares/error.js");
exports.newUser = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, photo, gender, _id, dob } = req.body;
    const formattedDob = (0, moment_1.default)(dob, 'DD-MM-YYYY').toDate();
    let user = yield user_js_1.User.findById(_id);
    if (user)
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
        });
    if (!_id || !name || !email || !photo || !gender || !dob)
        return next(new utility_class_js_1.default("Please add all fields", 400));
    user = yield user_js_1.User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: formattedDob,
    });
    return res.status(201).json({
        success: true,
        message: `WELCOME, ${user.name}`,
    });
}));
exports.getAllUsers = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_js_1.User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
}));
exports.getUser = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_js_1.User.findById(id);
    if (!user)
        return next(new utility_class_js_1.default("Invalid Id", 400));
    return res.status(200).json({
        success: true,
        user,
    });
}));
exports.deleteUser = (0, error_js_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_js_1.User.findById(id);
    if (!user)
        return next(new utility_class_js_1.default("Invalid Id", 400));
    yield user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
}));
