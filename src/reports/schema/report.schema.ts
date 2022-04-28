import * as mongoose from 'mongoose';

export const ReportSchema = new mongoose.Schema({
  userName: String,
  age: String,
  height: String,
  Gender: String,
  sales: String,
  lastPurchasedDate: Date
});
