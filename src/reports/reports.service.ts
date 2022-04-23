import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csvtojson';

@Injectable()
export class ReportsService {
  constructor() {}

  allFiles(res): void {
    const directoryPath = path.join(process.cwd(), `/files/`);
    fs.readdir(directoryPath, (err, files) => {
      //handling error
      if (err) {
        console.log('Unable to scan directory: ' + err);
      }
      res.send(files);
    });
  }

  async findReport(queryParams, res): Promise<any> {
    const directoryPath = path.join(process.cwd(), `/files/`);
    const csvFilePath = `${directoryPath}${queryParams.csvFile}`;

    if (!queryParams.csvFile) {
      return res.send('Please provide a CSV file');
    }

    const jsonFile = await csv().fromFile(csvFilePath);

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
              const date = new Date(result.LAST_PURCHASE_DATE);
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
              const date = new Date(result.LAST_PURCHASE_DATE);
              return date >= startDate && date <= startDate;
            });
            resolve(filterData);
          }
          if (queryParams.dateTo) {
            filterData = jsonFile.filter((result) => {
              const date = new Date(result.LAST_PURCHASE_DATE);
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
    res.send(await dateRangeFilter);
  }
  async create(data_csv: any): Promise<any> {
    if (typeof data_csv === 'undefined') {
      return 'Please provide a CSV file';
    }
    const response = {
      file: data_csv.originalname,
      size: data_csv.size,
    };
    return response;
  }
}
