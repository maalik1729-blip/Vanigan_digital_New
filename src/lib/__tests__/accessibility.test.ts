import { describe, it, expect } from 'vitest';
import { createAriaLabel, meetsContrastRatio } from '../accessibility';

describe('accessibility utilities', () => {
  describe('createAriaLabel', () => {
    it('should create label with action only', () => {
      expect(createAriaLabel('Download')).toBe('Download');
    });

    it('should create label with action and item', () => {
      expect(createAriaLabel('Download', 'certificate')).toBe('Download certificate');
    });

    it('should create label for edit action', () => {
      expect(createAriaLabel('Edit', 'membership')).toBe('Edit membership');
    });
  });

  describe('meetsContrastRatio', () => {
    it('should return true for sufficient contrast (black on white)', () => {
      expect(meetsContrastRatio('#000000', '#ffffff')).toBe(true);
    });

    it('should return false for insufficient contrast (light gray on white)', () => {
      expect(meetsContrastRatio('#cccccc', '#ffffff')).toBe(false);
    });

    it('should return true for WCAG AA compliant colors', () => {
      // Dark blue on white (primary button)
      expect(meetsContrastRatio('#1e3a8a', '#ffffff')).toBe(true);
    });

    it('should validate muted text contrast', () => {
      // Test the updated muted-foreground color
      // oklch(48% 0.015 240) converts approximately to a darker gray
      // This should now pass WCAG AA on white background
      expect(meetsContrastRatio('#767676', '#ffffff')).toBe(true);
    });
  });
});
