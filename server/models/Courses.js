import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id : { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  Price: { type: Number, default: 100 },
  image: { type: String, required: true },
  website: { type: String, required: true },
});

export const Courses = mongoose.model("Courses", schema);
