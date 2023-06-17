import { Controller, Post } from '@nestjs/common';
import { PopulateDbService } from './populatedb.service';

@Controller("populateDb")
export class PopulateDbController {

    constructor(private populateDbService: PopulateDbService) {}

    @Post()
    async populate() {
        return this.populateDbService.populate();
    }
}
