import { Controller, Post } from '@nestjs/common';
import { PopulateDbService } from 'src/populateDb/populateDb.service';

@Controller("populateDb")
export class PopulateDbController {

    constructor(private populateDbService: PopulateDbService) {}

    @Post()
    async populate() {
        return this.populateDbService.populate();
    }
}
