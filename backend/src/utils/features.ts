import mongoose from "mongoose";
import { myCache } from "../app";
import { Product } from "../models/product";
import { Document } from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types";

export const connectDB = async () => {
  try {
    const atlasConnectionUri = "mongodb+srv://abhi:abhi007@cluster0.gct2pwc.mongodb.net/";

    await mongoose.connect(atlasConnectionUri, {
      dbName: 'Ecommerce_24', // Change this to your desired database name
    });

    console.log('DB Connected to', mongoose.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(productKeys);
  }
  if (order) {
     const ordersKeys: string[] = [
     "all-orders",
       `my-orders-${userId}`,
       `order-${orderId}`,
     ];

     myCache.del(ordersKeys);
  }
  if (admin) {
     myCache.del([
       "admin-stats",
       "admin-pie-charts",
       "admin-bar-charts",
       "admin-line-charts",
     ]);
  }
};


export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};


export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};

interface MyDocument extends Document {
  createdAt : Date;
  discount?: number;
  total?: number;

}
export {MyDocument};
type FuncProps = {
  length: number;
  docArr: MyDocument[]; // Ensure this is correctly defined
  today: Date;
  property?: "discount" | "total";
};


export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};




