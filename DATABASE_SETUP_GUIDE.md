# Database Connection Guide (Next.js + MongoDB)

This guide explains how to connect your Ambre Candle application to a real database (MongoDB) to save orders permanently.

## Step 1: Create a Database Cloud Account
1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** and sign up for free.
2. Create a new **Cluster** (Select the free Shared tier).
3. Create a **Database User** (Username/Password).
4. In Network Access, allow access from anywhere (Add IP Address `0.0.0.0/0`).
5. **Get Connection String:** Click "Connect" > "Connect your application". Copy the string (looks like `mongodb+srv://<username>:<password>@cluster0...`).

## Step 2: Configure Environment Variables
1. Create a file named `.env.local` in your project root folder.
2. Add your connection string inside it:
   ```env
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/ambre_candles?retryWrites=true&w=majority
   ```

## Step 3: Install Mongoose
This library helps Next.js talk to MongoDB.
Run this in your terminal:
```bash
npm install mongoose
```

## Step 4: Create Connection Logic
Create a new file `lib/db.js` to handle the connection efficiently.

```javascript
/* lib/db.js */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

## Step 5: Define Order Structure (Schema)
Create a file `models/Order.js` to define what an order looks like.

```javascript
/* models/Order.js */
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  address: String,
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
```

## Step 6: Create the API Route
Create a file `app/api/orders/route.js` to receive order requests.

```javascript
/* app/api/orders/route.js */
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
```

## Step 7: Update Checkout Page
Modify `app/checkout/page.js` to send data to this API instead of just localStorage.

```javascript
/* Inside handlePlaceOrder */
const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});

if (response.ok) {
    router.push('/order-tracking');
}
```
