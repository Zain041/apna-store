const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose
      .connect(
        process.env.MONGODB_URL ||
          "mongodb+srv://zaini:235896@cluster0.q48lj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          createIndexes: false,
        }
      )
      .then((res) =>
        console.log(`Database connected succesfully on ${res.connection.host}`)
      );
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = connectDB;
