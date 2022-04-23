import { Injectable } from '@nestjs/common';
import { Report } from './interface/reports.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel('Reports') private readonly reportModel: Model<Report>,
  ) {}
  async create(data_csv: any): Promise<object> {
    const response = {
      file: data_csv.originalname,
      size: data_csv.size,
    };
    return response;
  }
}
