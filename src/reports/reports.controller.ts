import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';

@Controller()
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('/sales/report/')
  async dataRange(@Query() queryParams, @Res() res: Response): Promise<void> {
    return this.reportService.findReport(queryParams, res);
  }

  @Get('/files')
  allFiles(@Res() res: Response) {
    return this.reportService.allFiles(res);
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
