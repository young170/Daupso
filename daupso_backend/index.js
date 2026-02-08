const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017/daupso";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Backend running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
});

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Products", ProductSchema); // create product schema

// Seed Products POST method for testing
app.post("/seed-products", async (req, res) => {
  try {
    await Product.deleteMany({}); // clear old sample data

    const sampleProducts = [
      {
        name: "Nike Running Shoes",
        price: 120,
        category: "Shoes",
        description: "Comfortable running shoes",
      },
      {
        name: "Adidas Hoodie",
        price: 80,
        category: "Clothing",
        description: "Warm hoodie",
      },
      {
        name: "iPhone Case",
        price: 25,
        category: "Accessories",
        description: "Shockproof phone case",
      },
    ];

    await Product.insertMany(sampleProducts);

    res.json({ message: "Sample products inserted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET method for searching products
app.get("/products/search", async (req, res) => {
  const query = req.query.q;

  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // case-insensitive
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    console.log("userId:", user._id);
    console.log("userIdAdmin:", user.isAdmin);

    res.json({
      message: "Login successful",
      userId: user._id,
      userIsAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// admin control
const adminOnly = async (req, res, next) => {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(401).json({ message: "No user ID provided" });
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch {
    return res.status(401).json({ message: "Invalid user ID" });
  }

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

app.get("/admin/users", adminOnly, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

app.post("/admin/users", adminOnly, async (req, res) => {
  const { email, password, isAdmin } = req.body;

  const user = new User({ email, password, isAdmin });
  await user.save();

  res.json(user);
});

app.put("/admin/users/:id", adminOnly, async (req, res) => {
  const { email, isAdmin } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { email, isAdmin },
    { new: true }
  );

  res.json(user);
});

app.delete("/admin/users/:id", adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});
