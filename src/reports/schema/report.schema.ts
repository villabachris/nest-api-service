import * as mongoose from 'mongoose';

export const ReportSchema = new mongoose.Schema({
  file: String,
  size: Number,
  buffer: String,
});
