import express from "express";
import * as NotesController from "../controllers/notes";

const router = express.Router();

// get all routes
router.get("/", NotesController.getNotes);

// get one note
router.get("/:noteId", NotesController.getNote);

// create note
router.post("/", NotesController.createNote);

// update note
router.patch("/:noteId", NotesController.updateNote);

// delete note
router.delete("/:noteId", NotesController.deleteNote);

export default router;
