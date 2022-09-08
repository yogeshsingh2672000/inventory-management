const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const Product = require("../models/Product");

// Route 1: Creating a new product POST: /create
router.post(
  "/create",
  [
    body("productName", "Name cannot be empty").exists().isLength({ min: 2 }),
    body("price", "price cannot be a String and cannot be empty")
      .exists()
      .isString()
      .isLength({ min: 1 }),
    body("category", "Please enter category").exists().isLength({ min: 3 }),
  ],
  fetchuser,
  async (req, res) => {
    // validating reqests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productName, price, category } = req.body;
      const product = await Product.findOne({ name: productName });
      if (product != null && product.name == productName) {
        return res.status(400).json({ error: "this product is already exist" });
      }
      const newProduct = await Product({
        name: productName,
        price: price,
        category: category,
      });

      newProduct.save();
      res.json(newProduct);
    } catch (error) {
      res.status(500).send("Internal server Error");
    }
  }
);

// Route 2: fetch all product with and without category GET: /get
router.get("/get", fetchuser, async (req, res) => {
  try {
    // when don't have query
    if (Object.keys(req.query).length === 0) {
      const products = await Product.find();
      return res.json(products);
    }
    // when we have query but checking if it is what we are looking or not
    else if (Object.keys(req.query).includes("category")) {
      const products = await Product.find({ category: req.query.category });
      return res.json(products);
    }

    // default case
    res.json("No products are found");
  } catch (error) {
    res.status(500).send("Internal server Error");
  }
});

// Route 3: update product PUT: /get
router.put(
  "/update",
  [
    body("productName", "Name cannot be empty")
      .exists()
      .isString()
      .isLength({ min: 2 }),
    body("new", "new cannot be empty").exists(),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { productName } = req.body;
      const product = await Product.findOne({
        name: productName,
      });
      if (product == null) {
        return res.status(400).json({ error: "product dosn't exists" });
      }
      const newProduct = await Product.findByIdAndUpdate(
        product.id,
        {
          $set: {
            name: req.body.new.name,
            price: req.body.new.price,
            category: req.body.new.category,
          },
        },
        { new: true }
      );
      res.json(newProduct);
    } catch (error) {
      res.status(500).send("Internal server Error");
    }
    // res.json("success");
  }
);

// Route 4: delete product DELETE: /get
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Wrong Id" });
  }
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: "delete successfully" });
  } catch (error) {
    return res.status(500).send("Internal server Error");
  }
});

// Route 4: delete product category wise DELETE: /get
router.delete("/category/delete/:category", fetchuser, async (req, res) => {
  // fetching the product list based on category
  const product = await Product.find({ category: req.params.category });

  if (product.length === 0) {
    return res.status(400).json({ error: "Product not found" });
  }
  try {
    const deleteProduct = await Product.deleteMany({
      category: req.params.category,
    });
    return res.json({ success: "delete successfully" });
  } catch (error) {
    return res.status(500).send("Internal server Error");
  }
});

module.exports = router;
