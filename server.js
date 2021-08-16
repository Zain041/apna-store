const express = require("express");
const app = express();
const path = require("path");
const nodemailer = require("./Email/Nodemailer");
var cors = require("cors");
require("dotenv").config();
const connectDB = require("./DB/Connection");

connectDB();

app.get("/",(req,res)=>{
  res.send("api working")
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", require("./routes/users"));

app.use("/api", require("./routes/stripePayment"));
app.use("/api", require("./routes/categories"));
app.use("/api", require("./routes/blogRoute"));
// coupon routes
let Coupons = require("./routes/Coupan");
app.post("/api/coupancreate", Coupons.create);
app.get("/api/coupon_gets", Coupons.getAll);
app.get("/api/coupon_get", Coupons.getone); 
app.post("/api/coupon_delete", Coupons.delete);
app.post("/api/coupanupdate", Coupons.update);

// app.use(express.static("./build"));
// app.get('/', (req, res) => {
//     res.json("works now")
// })

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.dirname(__dirname, "client", "build", "index.html"));
//   });
// }

const port = process.env.PORT || 4000; 
app.listen(port, (req, res) => {
  console.log(`server running ${port}`);
});
