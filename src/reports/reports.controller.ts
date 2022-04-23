import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as csv from 'csvtojson';
import { Response } from 'express';

@Controller()
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('/sales/report/')
  async dataRange(@Query() queryParams, @Res() res: Response): Promise<void> {
    const csvFilePath = path.join(
      process.cwd(),
      '/files/Book1.bed8ff05-9019-4abe-81b9-89cb8584c93a.csv',
    );
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
            filterData = jsonFile.filter((result) => {
              const date = new Date(result.LAST_PURCHASE_DATE);
              return date >= startDate && date <= endDate;
            });
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
          console.log(err);
        }
      } else {
        console.log('dasdas');
        filterData = jsonFile.map((data) => data);
        resolve(filterData);
      }
    });
    res.send(await dateRangeFilter);
  }

  @Post('/sales/record')
  @UseInterceptors(
    FileInterceptor('data_csv', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const origName = file.originalname;
          const fileName = `${
            origName.replace('.', ',').split(',')[0]
          }.${uuid()}`;
          return cb(null, `${fileName}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@UploadedFile() data_csv): Promise<object> {
    return this.reportService.create(data_csv);
  }
}
