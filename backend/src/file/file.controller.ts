import { Controller, Get, Header, Param, StreamableFile, UseFilters } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@ApiTags('files')
@Controller('files')
@UseFilters(new HttpExceptionFilter())
export class FileController {

    constructor(private fileService: FileService) {}

    @Get(':filename')
    @Header('Content-Type', 'image/png')
    getImageFromExternalApi(@Param('filename') filename: string): StreamableFile {
        return this.fileService.getFile(filename);
    }
}