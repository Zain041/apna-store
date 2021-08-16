const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const sendEmail = require("../Email/Nodemailer");

var code = Math.floor(100000 + Math.random() * 900000);

Router.post("/register", async (req, res) => {
  const { name, email, password, isAdmin, isVerified } = req.body;

  try {
    // if user exist
    let user = await User.findOne({ email });
    // console.log(user)
    if (user) {
      if (user.isVerified == false) {
        if (user.email) {
          //   console.log(user.email);
          //   console.log(code);
          sendEmail(user.email, code);
          return res
            .status(200)
            .json({ messages: [{ msg: "Email verification code send" }] });
        }
      }
      if (user.isVerified == true) {
        return res
          .status(201)
          .json({ messages: [{ msg: "Email is already Verified" }] });
      }
    }

    user = await new User({
      name,
      email,
      password,
      isAdmin,
      isVerified: isVerified ? isVerified : false,
    });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    let payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };
    // jsonwebtoken
    jwt.sign(payload, "jjjkukrhhhua", { expiresIn: 3000 }, (err, token) => {
      if (err) throw err;
      if (!user.isVerified) {
        if (email && code) {
          sendEmail(email, code);
          return res
            .status(200)
            .json({ messages: [{ msg: "Email verification code send" }] });
        }
      }
      return res
        .status(201)
        .json({ messages: [{ msg: "You are successfully Registered" }] });

      // res.json('Email verification link send')
      // res.json({ token, exp: exptime.exp, isAdmin: user.isAdmin, id: user.id, verification })
    });
  } catch (err) {
    return res.status(200).json({ errors: [{ msg: "Server Error" }] });
  }
});

Router.post("/get_profile", async (req, res) => {
  console.log(req.body.id);
  let user = await User.findOne({ _id: req.body.id });
  res.json({ user });
});

Router.get("/get_users", async (req, res) => {
  console.log(req.body.id);
  let user = await User.find();
  res.json({ user });
});

Router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // code = Math.floor((Math.random() * 100) + 90000)
  try {
    // if user exist
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    if (user.isVerified === false) {
      if (email && code) {
        sendEmail(email, code);
      }
      return res
        .status(401)
        .json({ errors: [{ msg: "Email Verification is required" }] });
    }

    // bcryptjs
    let matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    let payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      // process.env.JWT_SECRET,
      "kdjflajdfol",
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        const exptime = jwt.decode(token);

        // sendEmail(email, code)
        res.json({
          token,
          expire: exptime.exp,
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});
Router.get("/verify/:email/:id", async function (req, res) {
  console.log(code);
  if (req.params.id == code) {
    const verifyData = {
      isVerified: true,
    };
    await User.findOneAndUpdate({ email: req.params.email }, verifyData, {
      runValidators: true,
      useFindAndModify: false,
    });
    return res.status(200).json({ messages: [{ msg: "Your Email Verified" }] });
  } else {
    console.log("email is not verified");
    return res.status(401).json({ errors: [{ msg: "Your Token Expired" }] });
  }
});

module.exports = Router;
