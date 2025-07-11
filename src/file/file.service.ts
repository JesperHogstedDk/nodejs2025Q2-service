import { Injectable } from '@nestjs/common';
import * as fsPromises from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class FileService {
    constructor() {
        console.log('FileService constructor called!')
    }   

    async log(message: string) {
        const logPath = path.resolve('logs/log.txt')
        try {
            await fsPromises.appendFile(logPath, message + '\n', { flag: 'a'  } )
        } catch (error) {
            console.log('LogFile exception: ', error)
        }
    }

    async addFile(fileName: string) {
        // try {
        // const filePath = path.join(this.dirPath, fileName);
        // await fsPromises.writeFile(filePath, '', { flag: 'wx' });
        //     log(`File ${fileName} created successfully.`);
        // } catch (error) {
        //     log(`${OPERATION_FAILED}: ${error.message}`);
        // }
    }

    async createDirectory(logFolder: string) {
        try {
            // const currentPath = process.cwd()
            // console.log('Current path:', currentPath);
            console.log('logFolder: ', logFolder)
            const logFolderPath = path.resolve(logFolder)
            console.log('logFolderPath: ', logFolderPath)
            const logDir = await fsPromises.mkdir(logFolderPath, { recursive: true });
            if (logDir) {
                console.log(`Directory ${logDir} created successfully.`);
            } else {
                console.log(`Directory ${logFolder} was allready created.`);
            }
        } catch (error) {
            console.log(`OPERATION_FAILED: ${error.message}`);
        }
    }

}
