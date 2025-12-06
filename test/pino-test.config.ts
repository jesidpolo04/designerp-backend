import { LoggerModule } from 'nestjs-pino';
import { DynamicModule } from '@nestjs/common';
import { pinoConfig } from '../src/config/pino.config';

// LoggerModule preconfigurado para usarse en tests unitarios
export const TestPinoLoggerModule: DynamicModule = LoggerModule.forRoot({
  ...pinoConfig,
  pinoHttp: {
    ...(pinoConfig.pinoHttp || {}),
    level: 'silent',
    autoLogging: false,
  },
});
