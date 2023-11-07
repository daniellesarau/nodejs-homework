const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");

const addSchema = Joi.object({
 name: Joi.string(),
 email: Joi.string(),
 phone: Joi.string(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
 try {
  const result = await contacts.listContacts();
  res.json(result);
 } catch (error) {
  next(error);
 }
});

router.get("/:contactId", async (req, res, next) => {
 try {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
   throw new Error(`Contact with ${contactId} not found`);
  }
  res.json(result);
 } catch (error) {
  next(error);
 }
});

router.post("/", async (req, res, next) => {
 try {
  const validationError = addSchema.validate(req.body).error;
  if (validationError) {
   throw new Error(`Missing required field: ${validationError.message}`);
  }
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
 } catch (error) {
  next(error);
 }
});

router.delete("/:contactId", async (req, res, next) => {
 try {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
   throw new Error(`Contact with id ${contactId} not found`);
  }
  res.json({
   message: "The contact was successfully deleted",
  });
 } catch (error) {
  next(error);
 }
});

router.put("/:contactId", async (req, res, next) => {
 try {
  const validationError = addSchema.validate(req.body).error;
  if (validationError) {
   throw new Error(`Missing fields: ${validationError.message}`);
  }
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  if (!result) {
   throw new Error(`Contact with id ${contactId} not found`);
  }
  res.json(result);
 } catch (error) {
  next(error);
 }
});

module.exports = router;
