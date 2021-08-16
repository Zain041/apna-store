const express = require("express");
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const stripe = require("stripe")(
  "sk_test_51JAApYGPqHz8pu0HOOsn2av6m4KnwU2fbPAUfdBVSuhsXmL9YNpcRQ3BJn5d6jzUpyiIhiHHUvTfevEj0LSxGn3V00Q58jYN0a"
);

var sendEmail = require("../Email/Nodemailer");
const PaymentSchema = require("../Models/Payment");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const BilingInfoSchema = require("../Models/bilingInfo");
let paymentSuccess = false;

// All Bookings for AdminPanel
router.get("/bookings", async (req, res) => {
  try {
    let bookings = await PaymentSchema.find().sort({ startDate: -1 });
    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(200).json({ errors: [{ msg: "Bookings not fetched" }] });
  }
});

// My Bookings for userPanel
router.get("/booking/:id", async (req, res) => {
  try {
    let bookings = await PaymentSchema.find({ user: req.params.id });
    console.log(bookings);
    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(200).json({ errors: [{ msg: "Bookings not fetched" }] });
  }
});

var code = Math.floor(100000 + Math.random() * 900000);

// send Verification Bookings code on Email Address
router.get("/verifybooking/:email", async function (req, res) {
  try {
    let user_id = req.params.email;
    // console.log(user_id);

    // Check this is admin
    let user = await userSchema.findById({ _id: user_id });
    // console.log(user._doc.email);
    let email = user._doc.email;
    let mail = sendEmail(email, code);
    console.log(mail);
    return res.status(200).json({
      message: [{ msg: "Verification Code sent successfully" }],
      code,
      mail,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Verification Code not sent" }] });
  }
});

// verify Email
router.get("/verifymybooking/:id", async function (req, res) {
  if (req.params.id == code) {
    return res
      .status(200)
      .json({ message: [{ msg: "Your Booking Verified" }] });
  } else {
    return res.status(400).json({ errors: [{ msg: "Your Code Expired" }] });
  }
});

router.post("/stripe/charge", async (req, res) => {
  let { id, userId, name, email, phone, amount, status } = req.body;
  amount = amount * 100;
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Park Booking",
      // payment_method_types: ['card'],
      payment_method: id,
      confirm: true,
      receipt_email: email,
      // livemode: true
    });
    console.log(payment);
    const PaymentStudents = await PaymentSchema.find();
    if (payment.status === "succeeded") {
      const newStudent = new PaymentSchema({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        amount: payment.amount,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        Paid: true,
        user: userId,
      });
      await newStudent.save();
    }
    console.log(PaymentStudents);
    paymentSuccess = true;
    res.json({
      message: "Payment Successful",
      success: true,
    });

    // send email section
    var transporter = nodemailer.createTransport({
      service: "gmail",
      // port: 2525,
      port: 587,
      // ssl:     true,
      secure: false,
      requireTLS: true,
      auth: {
        user: "yourparadisepark1@gmail.com",
        pass: "Cacarella12",
      },
    });

    var mailOptions = {
      // from: 'yourparadisepark1@gmail.com"',
      from: `"Verify Email At Paradise Park" <yourparadisepark1@gmail.com>`,

      to: email,
      subject: "Sending Email using Node.js",
      // text: 'That was easy!',
      html: `<div style="background:red">
                <h1>Welcome </h1>
                <table border=1>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <tbody>
                <tr>
                <td>${name}</td>
                <td>${email}</td>
                <td>${phone}</td>
                <td>${payment.amount}</td>
                </tr>
                </tbody>
                </table>
            </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
  }
});
router.post("/paypal/charge", async (req, res) => {
  let { userId, name, email, amount } = req.body;

  try {
    const newStudent = new PaymentSchema({
      name: name,
      email: email,
      amount: amount,
      // startDate: req.body.startDate,
      // endDate: req.body.endDate,
      Paid: true,
      user: userId,
    });
    await newStudent.save();

    res.json({
      message: "Payment Successful",
      success: true,
    });

    // send email section
    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 2525,
      auth: {
        user: "kalikutti396@gmail.com",
        pass: "As@786195201",
      },
    });

    var mailOptions = {
      from: "kalikutti396@gmail.com",
      to: email,
      subject: "Sending Email using Node.js",
      // text: 'That was easy!',
      html: `<div style="background:red">
                <h1>Welcome </h1>
                <table border=1>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Roll no.</th>
                <tbody>
                <tr>
                <td>${name}</td>
                <td>${email}</td>
                <td>${phone}</td>
                <td>${payment.amount}</td>
                </tr>
                </tbody>
                </table>
            </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
  }
});

router.get("/alluserinvoices", async (req, res) => {
  try {
    const userInvoices = await PaymentSchema.find();

    res.send({ userInvoices });
  } catch (error) {
    console.log("could not fetch the invoice data", error);
  }
});

//fetch payments details of user by id means invoice data of single user
router.get("/invoice/:id", async (req, res) => {
  const user = req.params.id;
  try {
    const userInvoices = await PaymentSchema.find({ user });
    res.send({ userInvoices });
  } catch (error) {
    console.log("could not fetch the invoice data", error);
  }
});

// router.post("/formdata", async (req, res) => {
//   console.log("yes");
//   let {
//     firstName,
//     lastName,
//     email,
//     phone,
//     address,
//     city,
//     country,
//     state,
//     zip,
//   } = req.body;
//   try {
//     const newBilingDetail = new BilingInfoSchema({
//       firstname: firstName,
//       lastname: lastName,
//       email,
//       phone,
//       country,
//       city,
//       state,
//       address,
//       zip,
//     });
//     console.log(
//       firstName,
//       lastName,
//       email,
//       phone,
//       address,
//       city,
//       country,
//       state,
//       zip
//     );
//     const response = await newBilingDetail.save();
//     if (response) {
//       console.log(res);
//     }
//     res.json({
//       msg: "Data has been saved successfully",
//     });
//   } catch (error) {
//     console.log;
//   }
// });

module.exports = router;
