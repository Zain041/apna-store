const express = require("express");
const router = express.Router();
const path = require("path");
const Blog = require("../Models/blog");
const Comment=require("../Models/comment")
const cloudinary = require("cloudinary").v2;
const Order= require ('../Models/order')
const auth =require('../middleware/auth')
const Product = require("../Models/product")
const multer = require("multer");
const Rating =require("../Models/ratings")
const User =require("../models/User")
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require("express-validator");

const storageEngine = multer.diskStorage({
  destination: './public/uploads/categories/',
  filename: function (req, file, fn) {
    fn(null, req.body.categoryName + path.extname(file.originalname)); //+'-'+file.fieldname
  }
});

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 200000 },
  fileFilter: function (req, file, callback) {

    validateFile(file, callback);
  }
}).single('avatar');
var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}
cloudinary.config({
  cloud_name: "parking-app041",
  api_key: "522187368244197",
  api_secret: "_kgRpudcOL1CAy5McIDv-KVLNlk",
});





router.get(
  '/products',
  async (req, res) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
  

    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};

    const categoryFilter = category ? { category } : {};
  
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.count({
    
      ...nameFilter,
      ...categoryFilter,
    
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
    
      ...nameFilter,
    
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  }
);

router.post("/createproduct", async (req, res) => {
 

  upload(req, res, async (error) => {
    const {  name,price, description,brand,category,countInStock, } = req.body;

    if (error) {
      let msg = null;
      if (error.message) msg = error.message;
      else msg = error;
      return res.status(400).json({ errors: [{ msg: msg }] });
    } else {
      if (req.file == undefined) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Image does not exist" }] });
      } else {
        try {
          // if user exist
          var image = null;
          
        await cloudinary.uploader.upload( 
          req.file.path,
          {
            resource_type: "image",
            public_id: "blogImages/"  + uuidv4(),
            chunk_size: 6000000,
          },
          function (error, result) {
            image = result;
          },
         
        );
        const avatar=image.url;
      
      
      

       
        const product = new Product({
          name:name,
         
          imageUrl: avatar,
          price: price,
         
          category:category,
          brand: brand,
          countInStock: countInStock,
         
          description:description,
        });
        const createdProduct = await product.save();
        res.send({ message: 'Product Created', product: createdProduct });
     
      

        } catch (err) {
          console.log(err)
          return res.status(500).send("Server Error");
        }
      }
    }
    
  })
  
});



router.post("/createOrder",auth, async (req, res) => {
 

 
 

      try {
        if (req.body.orderItems.length === 0) {
          res.status(400).send({ message: 'Cart is empty' });
        } else {
          const order = new Order({
           
            orderItems: req.body.orderItems,
           
            itemsPrice: req.body.itemsPrice,
           
           
            totalPrice: req.body.totalPrice,
            orderStatus:"pending"
         
          });
        
        const createdOrder = await order.save();
        res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    
    
        }
       
      } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error");
      }
    
  
  


});

router.post("/updateOrderStatus", async (req, res) => {
 

 
 

  try {
    
      const order =  Order.findOneAndUpdate({_id:req.body.id},{ 
       
        
        orderStatus:req.body.orderStatus
     
      });
    
  
    res
    .status(201)
    .send({ message: 'New Order Created', order });


    }
   
   catch (err) {
    console.log(err)
    return res.status(500).send("Server Error");
  }





});

router.get("/getProducts", async (req, res) => {
  try {
    const allproducts = await Product.find();
    res.json({ allproducts });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.post("/getSingleProduct", async (req, res) => {
  try {
    const product = await Product.find({_id:req.body.id});
    res.json({ product });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.get("/getOrders", async (req, res) => {
  try {
    const allorders = await Order.find();
    res.json({ allorders });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/getUserOrders",auth, async (req, res) => {
  try {
    const orders = await Order.find({_id:req.user._id});
    res.json({ orders });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


router.post("/sendRating", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var { rating, feedback,productId  } = req.body;
   rating = parseFloat(rating);
   let user= await User.findOne({_id:req.user._id})


  try {
    let rate = new Rating({ userName: user.fullName, ratings:rating, feedback,product:productId });
    await rate.save();
    let product = await Product.findOne({ _id:productId }).select(
      "averageRating"
    );
   
    let receiverRatings = await Rating.find({ product: productId });
    console.log(receiverRatings)
    var sum = 0;
    receiverRatings.map((rat) => {
      sum += rat.ratings;
    });
    let avgRating = parseFloat(sum) / parseFloat(receiverRatings.length);
    console.log(avgRating)
    let finalProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { averageRating: avgRating } },
      { new: true }
    );
    return res.json({ rate, finalProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});




module.exports = router;
