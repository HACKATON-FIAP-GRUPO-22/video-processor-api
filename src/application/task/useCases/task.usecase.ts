import { Injectable } from '@nestjs/common';
import { IVideoUseCase } from '../../video/interfaces/video.usecase.interface';
import { ITaskGateway } from '../interfaces/task.gateway.interfaces';
import { ITaskUseCase } from '../interfaces/task.usecase.interfaces';
import { Video } from '../../../application/video/entites/video';

@Injectable()
export class TaskUseCase implements ITaskUseCase {
  constructor(
    private videoUseCase: IVideoUseCase,
    private gateway: ITaskGateway,
  ) {}

  async processListVideos() {
    try {
      const messages = await this.gateway.getQueueVideoForProcess();

      if (messages && messages.length > 0) {
        for (const message of messages) {
          console.log('TaskUseCase: mensagem recebida ', message.Body);

          try {
            const video: Video = new Video(message.Body);
            await this.videoUseCase.processVideo(video);
          } catch (error) {
            console.error('TaskUseCase: Erro ao processar mensagem:', error);
          }
          await this.gateway.deleteVideoTask(message.ReceiptHandle);
        }
      }
    } catch (error) {
      console.error('TaskUseCase: Erro ao receber mensagens:', error);
    }
  }

  async sendVideo(messageBody: string): Promise<void> {
    this.gateway.sendVideo(messageBody);
  }
}
