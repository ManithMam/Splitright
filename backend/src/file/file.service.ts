import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {

    getFile(filename: string): StreamableFile {
        const file = createReadStream(join(process.cwd(), 'resources', filename));

        if(!file) {
            throw new NotFoundException("File not found")
        }

        return new StreamableFile(file);
    }
}
