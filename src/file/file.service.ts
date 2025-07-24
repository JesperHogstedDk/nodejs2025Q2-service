import { Injectable, LogLevel } from '@nestjs/common';
import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class FileService {

  private maxSize: number;
  private logsFolder: string;
  private logFile: string = 'log.txt';
  private errorFile: string = 'error.txt';

  constructor() {
    this.maxSize = Number(process.env.MAX_SIZE ?? 5) * 1024;
    this.logsFolder = process.env.LOGSFOLDER ?? 'logs';
    // this.createDirectory(this.logsFolder);
  }

  private async createDirectory(logsFolder: string) {
    try {
      const logFolderPath = path.resolve(logsFolder);
      const logDir = await fsPromises.mkdir(logFolderPath, { recursive: true });
      if (logDir) {
        console.log(`Directory ${logDir} created successfully.`);
      } else {
        console.log(`Directory ${logsFolder} was allready created.`);
      }
    } catch (error) {
      console.log(`OPERATION_FAILED: ${error.message}`);
    }
  }


  private async existLogsFolder(logsFolder: string): Promise<boolean> {
    try {
      await fsPromises.access(logsFolder, fsPromises.constants.F_OK)
      return true;
    } catch (error) {
      return false;
    }
  }

  private async existsFile(filePath: string): Promise<boolean> {
    try {
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async isFileMaxSize(logsFile: string) {
    try {
      const stats = await fsPromises.stat(logsFile)
      if (stats.size > this.maxSize) {
        console.log('Logfile size: ', stats.size, 'rotating...')
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(`Error checking filesize! ${error.message}`);
      // throw new Error(`Error checking filesize! ${error.message}`);
    }
  }

  private async renameLogsFile(logsFilePath: string, level: LogLevel) {
    const oldFile = logsFilePath;
    const date = new Date().toISOString().replace(':', '').replace(':', '');
    const newFile = level === 'error' ?
    path.join(this.logsFolder, date + '.' + this.errorFile):  
    path.join(this.logsFolder, date + '.' + this.logFile);
    try {
      if (await this.existsFile(oldFile)) {
        await fsPromises.rename(oldFile, newFile);
      }
    } catch (error) {
      console.log(`Failed to rename logsfile: ${error.message}`);
      // throw new Error(`Failed to rename logsfile: ${error.message}`)
    }
    // console.log(`File renamed from ${this.logFile} to ${newFile} successfully.`);
  }

  async writeToFile(message: string, level: LogLevel = undefined) {
    const logsFile = level === 'error' ?
      path.resolve(this.logsFolder, this.errorFile) :
      path.resolve(this.logsFolder, this.logFile);

    if (!(await this.existLogsFolder(this.logsFolder))) {
      await this.createDirectory(this.logsFolder)
    }

    if (!(await this.existsFile(logsFile))) {
      await (await fsPromises.open(logsFile, 'a')).close();
    }

    if (await this.isFileMaxSize(logsFile)) {
      await this.renameLogsFile(logsFile, level);
    }

    try {
      await fsPromises.writeFile(logsFile, message + '\n', { flag: 'a' });
    } catch (error) {
      console.log('LogFile exception: ', error);
    }
  }

  async writeToErrorFile(message: string) {
    this.writeToFile(message, 'error');
  }
}