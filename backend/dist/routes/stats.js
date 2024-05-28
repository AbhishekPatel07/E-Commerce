"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stats_js_1 = require("../controllers/stats.js");
const app = express_1.default.Router();
// route - /api/v1/dashboard/stats
app.get("/stats", stats_js_1.getDashboardStats);
// route - /api/v1/dashboard/pie
app.get("/pie", stats_js_1.getPieCharts);
// route - /api/v1/dashboard/bar
app.get("/bar", stats_js_1.getBarCharts);
// route - /api/v1/dashboard/line
app.get("/line", stats_js_1.getLineCharts);
exports.default = app;
