import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/user.js';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import productRoute from "./routes/products.js";
import NodeCache from 'node-cache';
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import { config } from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from 'cors';

config({
  path:"./.env",
})
const port = process.env.PORT||7000;
const stripekey = process.env.STRIPE_KEY || ""; 

connectDB();

export const stripe = new Stripe(stripekey);
export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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



app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/dashboard",dashboardRoute);

app.use("/uploads",express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
