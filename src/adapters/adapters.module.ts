import { Module } from '@nestjs/common';
import { TaskController } from './task/controller/task.adapter.controller';
import { ITaskUseCase } from '../application/task/interfaces/task.usecase.interfaces';
import { TaskUseCase } from '../application/task/useCases/task.usecase';
import { IVideoUseCase } from '../application/video/interfaces/video.usecase.interface';
import { VideoUseCase } from '../application/video/useCases/video.usecase';
import { ITaskGateway } from '../application/task/interfaces/task.gateway.interfaces';
import { TaskGateway } from './task/gateway/task.gateway';
import { IStorageUseCase } from '../application/storage/interfaces/storage.interface';
import { StorageUseCase } from '../application/storage/useCases/storage.usecase';
import { IStorageGateway } from '../application/storage/interfaces/storage.gateway.interface';
import { StorageGateway } from './storage/gateway/storage.gateway';

@Module({
  imports: [],
  providers: [
    TaskController,
    {
      provide: ITaskUseCase,
      useClass: TaskUseCase,
    },
    {
      provide: IVideoUseCase,
      useClass: VideoUseCase,
    },
    {
      provide: ITaskGateway,
      useClass: TaskGateway,
    },
    {
      provide: IStorageUseCase,
      useClass: StorageUseCase,
    },
    {
      provide: IStorageGateway,
      useClass: StorageGateway,
    },
  ],
})
export class AdaptersModule {}
