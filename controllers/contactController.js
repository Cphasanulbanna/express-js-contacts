const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const Contacts = require("../models/contact.models");
var ObjectId = require("mongodb").ObjectID;

// @description : get all contacts
// @route : GET : /api/contacts/
// @access : private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contacts.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @description : create new contact
// @route : POST : /api/contacts/
// @access : private

const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;

  const contact = Contacts.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  } else if (typeof phone !== "number") {
    res.status(400);
    throw new Error("Phone number must be Number");
  } else {
    res.status(201).json(contact);
  }
});

// @description : create new contact
// @route : GET : /api/contacts/:id/
// @access : private

const getContact = asyncHandler(async (req, res) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    const contact = await Contacts.findById(req.params.id);
    if (contact) {
      res.status(200).json(contact);
    }
  } else {
    res.status(404);
    throw new Error("Contact no found!!!!!!!!!!!");
  }
});

// @description : update  contact
// @route : PUT : /api/contacts/:id/
// @access : private

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission to update other contacts");
  }

  const updatedContact = await Contacts.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

// @description : delete  contact
// @route : PUT : /api/contacts/:id/
// @access : private

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact no found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission to update other contacts");
  }

  contact.remove();
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
