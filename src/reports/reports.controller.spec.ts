import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('AppController', () => {
  let reportController: ReportsController;

  beforeEach(async () => {
    const report: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [ReportsService],
    }).compile();

    reportController = report.get<ReportsController>(ReportsController);
    
  });


  it('should be defined', () => {
    expect(reportController).toBeDefined();
  });
});
