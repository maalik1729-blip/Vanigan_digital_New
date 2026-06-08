import { describe, it, expect } from 'vitest';
import {
  PAGE_SIZE,
  DEFAULT_PAGE,
  CARD_WIDTH,
  CARD_HEIGHT,
  MAX_IMAGE_SIZE_MB,
  MOBILE_LENGTH,
  PIN_LENGTH,
  EPIC_REGEX,
  DEBOUNCE_DELAY,
  TOAST_DURATION,
  API_TIMEOUT,
  RETRY_ATTEMPTS,
} from '../constants';

describe('constants', () => {
  describe('Pagination', () => {
    it('should have page size defined', () => {
      expect(PAGE_SIZE).toBe(12);
      expect(DEFAULT_PAGE).toBe(1);
    });
  });

  describe('Card Dimensions', () => {
    it('should have card dimensions', () => {
      expect(CARD_WIDTH).toBe(421);
      expect(CARD_HEIGHT).toBe(590);
    });
  });

  describe('Validation', () => {
    it('should have mobile length', () => {
      expect(MOBILE_LENGTH).toBe(10);
    });

    it('should have PIN length', () => {
      expect(PIN_LENGTH).toBe(4);
    });

    it('should have EPIC regex pattern', () => {
      expect(EPIC_REGEX).toBeInstanceOf(RegExp);
      expect(EPIC_REGEX.test('ABC1234567')).toBe(true);
      expect(EPIC_REGEX.test('invalid')).toBe(false);
    });
  });

  describe('Timing', () => {
    it('should have debounce delay', () => {
      expect(DEBOUNCE_DELAY).toBe(300);
    });

    it('should have toast duration', () => {
      expect(TOAST_DURATION).toBe(3000);
    });
  });

  describe('API', () => {
    it('should have timeout setting', () => {
      expect(API_TIMEOUT).toBe(30000);
    });

    it('should have retry configuration', () => {
      expect(RETRY_ATTEMPTS).toBe(3);
    });
  });

  describe('Image Constraints', () => {
    it('should have max image size', () => {
      expect(MAX_IMAGE_SIZE_MB).toBe(5);
    });
  });
});
