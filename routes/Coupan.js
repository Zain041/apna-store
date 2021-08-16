const coupanCode = require("../models/CouponSchema");

const CoupanCrud = {
  create: async function (req, res) {
    const { code, discount } = req.body;
    console.log(code, discount);
    try {
      let user = await new coupanCode({
        code,
        discount,
      });

      await user.save();
      return res
        .status(200)
        .json({ messages: [{ msg: "Coupon set Successfully" }] });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async function (req, res) {
    try {
      // console.log(req.body.id)
      let user = await coupanCode.find();
      res.json({ user });
    } catch (err) {
      console.log(err);
    }
  },

  getone: async function (req, res) {
    try {
      // console.log(req.body.id)
      let user = await coupanCode.find().sort({ _id: -1 });
      res.json({ user });
    } catch (err) {
      console.log(err);
    }
  },

  delete: async function (req, res) {
    try {
      // console.log(req.body.id)
      let user = await coupanCode.findOneAndDelete(req.body.id);
      res.json({ user });
    } catch (err) {
      console.log(err);
    }
  },
  update: async function (req, res) {
    try {
      //   console.log(req.body.id);
      let id = req.body.id;
      delete req.body.id;
      let user = await coupanCode.findOneAndUpdate({ _id: id }, req.body);
      res.json({ user });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = CoupanCrud;
