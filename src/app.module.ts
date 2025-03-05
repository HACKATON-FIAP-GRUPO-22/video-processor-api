import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdaptersModule } from './adapters/adapters.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ApplicationModule,
    AdaptersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
