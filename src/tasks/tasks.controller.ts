import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get('service-time')
  serviceTime() {
    return {
      time: new Date().toLocaleString(),
    };
  }
}
