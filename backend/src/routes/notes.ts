import express from "express";
import * as NotesController from "../controllers/notes";

const router = express.Router();

// get all routes
router.get("/", NotesController.getNotes);

// get one note
router.get("/:noteId", NotesController.getNote);

// create post
router.post("/", NotesController.createNote);

export default router;
