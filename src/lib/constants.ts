/**
 * Application-wide constants
 * Eliminates magic numbers and improves code maintainability
 */

// Pagination
export const PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// ID Card Dimensions (px)
export const CARD_WIDTH = 421;
export const CARD_HEIGHT = 590;
export const CARD_BORDER_RADIUS = 24;

// Image constraints
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_WIDTH = 800;
export const MAX_IMAGE_HEIGHT = 800;
export const IMAGE_QUALITY = 0.7;

// Form validation
export const MIN_AGE = 18;
export const MAX_AGE = 120;
export const MOBILE_LENGTH = 10;
export const PIN_LENGTH = 4;
export const EPIC_REGEX = /^[a-zA-Z]{3}\d{7}$/;

// Timing
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 3000;
export const ANIMATION_DURATION = 200;

// API
export const API_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000;
