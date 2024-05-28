"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myCache = exports.stripe = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const features_js_1 = require("./utils/features.js");
const error_js_1 = require("./middlewares/error.js");
const products_js_1 = __importDefault(require("./routes/products.js"));
const node_cache_1 = __importDefault(require("node-cache"));
const order_js_1 = __importDefault(require("./routes/order.js"));
const payment_js_1 = __importDefault(require("./routes/payment.js"));
const stats_js_1 = __importDefault(require("./routes/stats.js"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const stripe_1 = __importDefault(require("stripe"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)({
    path: "./.env",
});
const port = process.env.PORT || 7000;
const stripekey = process.env.STRIPE_KEY || "";
(0, features_js_1.connectDB)();
exports.stripe = new stripe_1.default(stripekey);
exports.myCache = new node_cache_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Backend!');
});
/*app.post('/api/create', (req: Request, res: Response) => {
    // Access the request body
    const requestData = req.body;
  
    // Perform any necessary processing with the data
  
    // Send a response
    res.json({ message: 'POST request received successfully', data: requestData });
  });*/
app.use("/api/v1/user", user_js_1.default);
app.use("/api/v1/product", products_js_1.default);
app.use("/api/v1/order", order_js_1.default);
app.use("/api/v1/payment", payment_js_1.default);
app.use("/api/v1/dashboard", stats_js_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use(error_js_1.errorMiddleware);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
