import { Test, TestingModule } from '@nestjs/testing';
import { AdaptersModule } from './adapters.module';

describe('ApplicationModule', () => {
  let module: AdaptersModule;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AdaptersModule],
    }).compile();

    module = testingModule.get<AdaptersModule>(AdaptersModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
