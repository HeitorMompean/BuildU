import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('live')
  live(): { status: string } { return { status: 'ok' }; }
  @Get('ready')
  ready(): { status: string } { return { status: 'ready' }; }
}
