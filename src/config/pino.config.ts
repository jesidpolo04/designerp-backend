import { Params } from 'nestjs-pino';

export const pinoConfig: Params = {
  pinoHttp: {
    level:
      process.env.LOG_LEVEL ||
      (process.env.NODE_ENV !== 'production' ? 'debug' : 'info'),

    // Configuración para desarrollo (pretty printing)
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
              translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname',
              messageFormat: '[{context}] {msg}',
            },
          }
        : undefined,

    // Redactar información sensible
    redact: {
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.confirmPassword',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]',
    },

    // Props personalizados para cada request
    customProps: () => ({
      context: 'HTTP',
    }),

    // Configuración adicional
    formatters: {
      level: (label: string) => {
        return { level: label.toUpperCase() };
      },
    },

    // Configuración básica de auto logging
    autoLogging: true,
  },
};
