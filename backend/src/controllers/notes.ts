import { RequestHandler } from "express";
import NoteModel from "../models/note";

// GET ALL NOTES
export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// GET SPECIFIC NOTE
export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    const note = await NoteModel.findById(noteId).exec();
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// CREATE NOTE
export const createNote: RequestHandler = async (req, res, next) => {
  // get values outside the body
  const title = req.body.title;
  const text = req.body.text;

  try {
    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};
