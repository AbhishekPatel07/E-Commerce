"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_js_1 = require("../controllers/user.js");
const auth_js_1 = require("../middlewares/auth.js");
const app = express_1.default.Router();
//route- /api/v1/user/new
app.post("/new", user_js_1.newUser);
//route -/api/v1/user/all
app.get("/all", auth_js_1.adminOnly, user_js_1.getAllUsers);
//route - /api/v1/user/dynamicID
app.get("/:id", user_js_1.getUser);
app.delete("/:id", auth_js_1.adminOnly, user_js_1.deleteUser);
exports.default = app;
