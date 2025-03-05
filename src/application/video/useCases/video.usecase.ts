import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IStorageUseCase } from '../../storage/interfaces/storage.interface';
import { ITaskUseCase } from '../../task/interfaces/task.usecase.interfaces';
import { Video } from '../entites/video';
import { IVideoUseCase } from '../interfaces/video.usecase.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as AdmZip from 'adm-zip';

@Injectable()
export class VideoUseCase implements IVideoUseCase {
  private tmp = '/tmp';
  private interval = 20;

  constructor(
    private storage: IStorageUseCase,
    @Inject(forwardRef(() => ITaskUseCase))
    private task: ITaskUseCase,
  ) {}

  async processVideo(video: Video): Promise<void> {
    try {
      if (video.idVideo.includes('video_erro')) {
        throw new Error('Video com erro');
      }
      const localVideoPath = path.join(this.tmp, video.idVideo);
      const outputFolder = path.join(this.tmp, 'output_images');
      const zipFilePath = path.join(this.tmp, 'output_images.zip');

      await this.downloadFileToDisk(video.idVideo, localVideoPath);
      fs.mkdirSync(outputFolder, { recursive: true });
      const duration = await this.getVideoDuration(localVideoPath);

      await this.extractFrames(
        video.idVideo,
        localVideoPath,
        outputFolder,
        duration,
      );
      this.createZip(outputFolder, zipFilePath);

      const zipKey = `${video.idVideo}_processed`;
      await this.storage.uploadFile(
        zipKey,
        fs.readFileSync(zipFilePath),
        'application/zip',
      );

      await this.task.sendVideo(`{"id": ${video.idVideo}, "status": "pronto"}`);

      this.cleanTmpFolder([video.idVideo, outputFolder, zipFilePath]);
    } catch (error) {
      console.log(error);
      await this.task.sendVideo(`{"id": "${video.idVideo}", "status": "erro"}`);
    }
  }

  private async downloadFileToDisk(
    key: string,
    localPath: string,
  ): Promise<void> {
    const fileStream = fs.createWriteStream(localPath);
    const s3Stream = await this.storage.downloadFile(key);

    await new Promise<void>((resolve, reject) => {
      s3Stream.pipe(fileStream).on('finish', resolve).on('error', reject);
    });
  }

  private getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration);
      });
    });
  }

  private async extractFrames(
    id: string,
    videoPath: string,
    outputFolder: string,
    duration: number,
  ) {
    for (let second = 0; second < duration; second += this.interval) {
      await this.captureFrame(id, videoPath, outputFolder, second);
    }
  }

  private captureFrame(
    id: string,
    videoPath: string,
    outputFolder: string,
    second: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const outputFileName = `frame_${id}_${second}.jpg`;
      const outputPath = path.join(outputFolder, outputFileName);

      ffmpeg(videoPath)
        .seekInput(second)
        .frames(1)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });
  }

  private createZip(folder: string, zipPath: string) {
    const zip = new AdmZip();
    fs.readdirSync(folder).forEach((file) => {
      const filePath = path.join(folder, file);
      zip.addLocalFile(filePath);
    });
    zip.writeZip(zipPath);
  }

  private cleanTmpFolder(files: string[]) {
    for (const file of files) {
      const filePath = path.join(this.tmp, file);
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    }
  }
}
