import * as mongoose from 'mongoose';

export const ReportsSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
});
