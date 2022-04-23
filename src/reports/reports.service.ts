import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  constructor() {}
  async create(data_csv: any): Promise<object> {
    const response = {
      file: data_csv.originalname,
      size: data_csv.size,
    };
    return response;
  }
}
