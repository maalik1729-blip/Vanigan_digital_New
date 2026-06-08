/**
 * Production-safe logger that suppresses console output in production builds
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    } else {
      // In production, send to error tracking service (e.g., Sentry)
      // Sentry.captureException(args[0]);
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
};
