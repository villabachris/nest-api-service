import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csvtojson';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './interfaces/report.interface';

@Injectable()
export class ReportsService {
  constructor(@InjectModel('Report') private reportModel: Model<Report>) {}

  async findReport(id, queryParams): Promise<any> {
    const data = await this.reportModel.findOne({ _id: id });
    const record = data.buffer;
    const headers = [
      'userName',
      'age',
      'height',
      'Gender',
      'sales',
      'lastPurchasedDate',
    ];

    const jsonFile = await csv({ headers: headers }).fromString(record);

    const dateRangeFilter = new Promise((resolve) => {
      let filterData;
      if (Object.keys(queryParams).length) {
        try {
          const startDate = queryParams.dateFrom
            ? new Date(queryParams.dateFrom.toString())
            : '';
          const endDate = queryParams.dateTo
            ? new Date(queryParams.dateTo.toString())
            : '';
          if (queryParams.dateFrom && queryParams.dateTo) {
            if (startDate > endDate) {
              resolve(`Date From cannot be later than Date to`);
            } else if (endDate < startDate) {
              resolve(`Date to cannot be earlier than Date From`);
            }
            filterData = jsonFile.filter((result) => {
              const date = new Date(result.lastPurchasedDate);
              return date >= startDate && date <= endDate;
            });
            if (filterData.length === 0) {
              resolve(
                `No data at range between of ${queryParams.dateFrom} and ${queryParams.dateTo}`,
              );
            }
            resolve(filterData);
          }
          if (queryParams.dateFrom) {
            filterData = jsonFile.filter((result) => {
              const date = new Date(result.lastPurchasedDate);
              return date >= startDate && date <= startDate;
            });
            resolve(filterData);
          }
          if (queryParams.dateTo) {
            filterData = jsonFile.filter((result) => {
              const date = new Date(result.lastPurchasedDate);
              return date >= endDate && date <= endDate;
            });
            resolve(filterData);
          }
        } catch (err) {
          console.log('err', err);
        }
      } else {
        filterData = jsonFile.map((data) => data);
        resolve(filterData);
      }
    });
    return await dateRangeFilter;
  }

  async create(data_csv): Promise<any> {
    const response = {
      file: data_csv.originalname,
      buffer: data_csv.buffer,
      size: data_csv.size,
    };

    const newRecord = new this.reportModel(response);
    return await newRecord.save();
  }
}
