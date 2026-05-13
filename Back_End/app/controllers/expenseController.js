import Expense from "../models/expenseModel.js";
import { validateExpense } from "../validators/expenseValidator.js";
import { scanBill } from "../utils/ocrService.js";
import fs from "fs";

export const scanExpenseBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image or PDF" });
    }

    const billData = await scanBill(req.file.path, req.file.mimetype);
    
    // Cleanup: Remove the uploaded file after scanning
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.status(200).json(billData);
  } catch (error) {
    console.error("Scan Error:", error);
    res.status(500).json({ message: "Failed to process the bill image" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { error } = validateExpense(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const newExpense = new Expense({
      ...req.body,
      userId: req.user.id,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { error } = validateExpense(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedExpense)
      return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense" });
  }
};
