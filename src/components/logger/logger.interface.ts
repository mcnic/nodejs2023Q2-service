export const logLevels = {
  0: 'error',
  1: 'warn',
  2: 'log',
  3: 'debug',
  4: 'verbose',
};

export type LogLevel = 0 | 1 | 2 | 3 | 4;

export type LoggerParams = {
  level: number;
  date: string;
  message: string | JSON;
};

export type FileLoggerParams = LoggerParams & {
  ttyColorCode: number;
};
