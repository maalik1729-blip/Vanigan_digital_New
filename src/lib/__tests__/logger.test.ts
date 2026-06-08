import { describe, it, expect, vi } from 'vitest';
import { logger } from '../logger';

describe('logger', () => {
  it('should have log method', () => {
    expect(logger.log).toBeDefined();
    expect(typeof logger.log).toBe('function');
  });

  it('should have warn method', () => {
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('should have error method', () => {
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('should not throw when calling log methods', () => {
    expect(() => logger.log('test')).not.toThrow();
    expect(() => logger.warn('test')).not.toThrow();
    expect(() => logger.error('test')).not.toThrow();
  });
});
