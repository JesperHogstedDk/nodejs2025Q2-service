
import { Global, Module } from "@nestjs/common";
import { JsonLogService } from "./json.log.service";
import { LogService } from "./log.service";
import { FileLogService } from "./file.log.service";

@Global()
@Module({
    providers: [LogService], //, JsonLogService, FileLogService],
    exports: [LogService] //, JsonLogService, FileLogService],
})
export class LogModule { }
