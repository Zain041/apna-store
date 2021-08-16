const express = require("express");
const router = express.Router();
const path = require("path");

const Category=require("../models/categories")










router.post("/addCategory", async (req, res) => {
 

  
    const {  categoryName } = req.body;

    
     
      
    
        try {
         
          
        const category = new Category({
          categoryName:categoryName,
         
        });
         await category.save();
        res.send({ message: 'Category Created', category: category });
     
      

        } catch (err) {
          console.log(err)
          return res.status(500).send("Server Error");
        }
      
    
    
  
  
});



router.get("/getCategories", async (req, res) => {
  try {

    const categories = await Category.find();
    res.json({ categories });
    
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});









router.post("/updateCategory", async (req, res) => {
  try {
    const { categoryName ,id} = req.body;
    console.log(id)

    const category = await Category.findOneAndUpdate(
      { _id:id },
      {
        categoryName:categoryName
      }
    );
    

    res.json({
      msg: "Updated!",
     category
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
router.post("/deleteCategory", async (req, res) => {
    try {
      const {id} = req.body;
  
      const category = await Category.findOneAndDelete(
        { _id:id }
        
      );
      
  
      res.json({
        msg: "deleted!",
       category
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });

module.exports = router;
