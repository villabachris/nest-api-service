import {
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { Report } from './interfaces/report.interface';

@Controller('sales')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('report')
  async dataRange(@Query() queryParams): Promise<Report> {
    return this.reportService.findReport(queryParams);
  }

  @Post('/record')
  @UseInterceptors(FileInterceptor('data_csv'))
  async create(@UploadedFile() data_csv): Promise<any> {
    if (typeof data_csv === 'undefined') {
      return 'Please provide a CSV file';
    }
    return this.reportService.create(data_csv);
  }
}
