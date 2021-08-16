const express = require("express");
const router = express.Router();
const fs = require("fs");
const upload = require("../multer");
const cloudinary = require("../cloudinary");
const Shop = require("../Models/ShopModel");

router.post("/", upload.array("image"), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "images");
  if (req.method === "POST") {
    const urls = [];
    const files = req.files;
    const { name, price, email } = req.body;

    // console.log(name, email, price)

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      const imageData = {
        url: newPath.url,
        secureurl: newPath.secure_url,
        public_id: newPath.public_id,
      };
      urls.push(imageData);
      fs.unlinkSync(path);
    }

    let newShop = new Shop({
      // name: name,
      email: email,
      pics: urls,
    });

    await newShop.save();
    res.status(200).json({
      message: "Shop created successfully",
      data: newShop,
    });
  } else {
    res.status(405).json({
      message: "Shop not created successfully",
    });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post("/:id/reviews", async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Shop.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Shop already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

module.exports = router;
