const express = require("express")
const errorHandlor = require("./middleware/errorHandlor")
const dotenv = require("dotenv").config()
var mongoose = require("mongoose");
var cors = require('cors')

const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use("/api/contacts", require("./routes/contactRoute"))
app.use("/api/users", require("./routes/userRoute"))
app.use(errorHandlor)

//MongoDB connection
mongoose.connect("mongodb://localhost/contacts", { useNewUrlParser: true });
mongoose.connection
  .once("open", function () {
    console.log("Database connected Successfully");
  })
  .on("error", function (err) {
    console.log("Error", err);
  });

  //SERVER
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})