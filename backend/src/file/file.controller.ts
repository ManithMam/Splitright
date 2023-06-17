import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileController {

    constructor(private fileService: FileService) {}

    @Get(':filename')
    @Header('Content-Type', 'image/jpeg')
    getImageFromExternalApi(@Param('filename') filename: string): StreamableFile {
        return this.fileService.getFile(filename);
    }
}