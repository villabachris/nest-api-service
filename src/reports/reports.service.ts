import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './interfaces/report.interface';

@Injectable()
export class ReportsService {
  constructor(@InjectModel('Report') private reportModel: Model<Report>) {}
  async findReport(queryParams): Promise<any> {
    if (Object.keys(queryParams).length) {
      const startDate = queryParams.dateFrom
        ? new Date(queryParams.dateFrom)
        : '';

      const endDate = queryParams.dateTo ? new Date(queryParams.dateTo) : '';

      if (!startDate) {
        return 'No data found';
      }
      if (startDate || endDate) {
        return !endDate
          ? this.reportModel.find({
              lastPurchasedDate: {
                $gte: startDate.setDate(startDate.getDate() + 1),
                $lte: startDate,
              },
            })
          : this.reportModel.find({
              lastPurchasedDate: {
                $gte: startDate.setDate(startDate.getDate() + 1),
                $lte: endDate.setDate(endDate.getDate() + 1),
              },
            });
      }
    }
    return this.reportModel.find();
  }

  async create(data_csv): Promise<any> {
    const headers = [
      'userName',
      'age',
      'height',
      'Gender',
      'sales',
      'lastPurchasedDate',
    ];

    const jsonFile = await csv({ headers: headers }).fromString(
      data_csv.buffer.toString(),
    );

    const newRecord = jsonFile.map((data) => {
      const report = new this.reportModel(data);
      return new Promise((resolve) => {
        report.save((err, result) => {
          resolve(result);
        });
      });
    });

    return Promise.all(newRecord);
  }
}
