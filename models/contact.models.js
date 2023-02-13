const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

let ContactsSchema = new Schema({
  user_id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref: "User"
  },
  name: {
    type: String,
    // required: [true, "name is required"]
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, "This contact already exists"]
    // required: [true, "email is required"]
  },
  phone: {
    type: Number,
    required: true
    // required: [true, "phone number is required"]
  },

}, {
    timestamps: true
});

module.exports = model("Contacts", ContactsSchema);