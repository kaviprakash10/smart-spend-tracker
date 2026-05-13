import express from "express";
import multer from "multer";
import path from "path";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  scanExpenseBill,
} from "../controllers/expenseController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowedExt = [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".pdf"].includes(ext);
    const isAllowedMime = file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";

    if (isAllowedExt || isAllowedMime) {
      return cb(null, true);
    }
    cb(new Error("Only images and PDF files are allowed!"));
  },
});

router.use(protectRoute);

router.route("/").get(getExpenses).post(createExpense);
router.route("/scan").post(upload.single("bill"), scanExpenseBill);

router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
