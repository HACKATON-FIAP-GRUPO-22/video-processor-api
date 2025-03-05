export abstract class ITaskGateway {
  abstract sendVideo(messageBody: string): Promise<void>;
  abstract getQueueVideoForProcess(): Promise<any[]>;
  abstract deleteVideoTask(any): Promise<void>;
}
