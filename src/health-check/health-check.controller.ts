import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {


    @Get()
    getHealthCheck() {
        return 'Client-Gateway is up and running';
    }
}
