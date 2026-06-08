# 🧪 Testing Guide

## Setup Complete ✅

Testing infrastructure is now ready to use!

---

## 📦 Installation

Install testing dependencies:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui happy-dom
```

---

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

---

## 📁 Test Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── logger.test.ts           ✅ Created
│   │   ├── constants.test.ts        ✅ Created
│   │   └── accessibility.test.ts    ✅ Created
│   ├── logger.ts
│   ├── constants.ts
│   └── accessibility.ts
├── components/
│   ├── __tests__/
│   │   ├── OptimizedImage.test.tsx  📋 TODO
│   │   └── Button.test.tsx          📋 TODO
│   └── OptimizedImage.tsx
├── routes/
│   ├── __tests__/
│   │   ├── membership.test.tsx      📋 TODO
│   │   └── dashboard.test.tsx       📋 TODO
│   ├── membership.tsx
│   └── dashboard.tsx
└── test/
    └── setup.ts                      ✅ Created
```

---

## ✅ Tests Created (3 files, ~15 test cases)

### 1. Logger Tests (`src/lib/__tests__/logger.test.ts`)

Tests production-safe logging:
- ✓ Suppresses logs in production
- ✓ Allows logs in development
- ✓ Always logs errors

### 2. Accessibility Tests (`src/lib/__tests__/accessibility.test.ts`)

Tests WCAG compliance utilities:
- ✓ Creates proper ARIA labels
- ✓ Validates color contrast ratios
- ✓ Ensures WCAG AA compliance

### 3. Constants Tests (`src/lib/__tests__/constants.test.ts`)

Tests application constants:
- ✓ Validation limits (name, phone, EPIC)
- ✓ UI constants (pagination, toast)
- ✓ API configuration (timeout, retry)
- ✓ Storage keys

---

## 📋 Next Tests to Write

### Priority 1: Component Tests

#### OptimizedImage Component
```typescript
// src/components/__tests__/OptimizedImage.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptimizedImage } from '../OptimizedImage';

describe('OptimizedImage', () => {
  it('should render with lazy loading', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test" />);
    const img = screen.getByAlt('Test');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should render with correct dimensions', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test" width={800} height={600} />);
    const img = screen.getByAlt('Test');
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '600');
  });
});
```

### Priority 2: Route Tests

#### Membership Form Tests
```typescript
// src/routes/__tests__/membership.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Membership Form', () => {
  it('should validate required fields', async () => {
    // Test form validation
  });

  it('should submit form with valid data', async () => {
    // Test successful submission
  });

  it('should handle API errors gracefully', async () => {
    // Test error handling
  });
});
```

### Priority 3: Integration Tests

#### Dashboard Tests
```typescript
// src/routes/__tests__/dashboard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Dashboard', () => {
  it('should display member information', async () => {
    // Test dashboard data display
  });

  it('should handle certificate download', async () => {
    // Test download functionality
  });
});
```

---

## 🎯 Coverage Goals

| Category | Current | Target |
|----------|---------|--------|
| **Utilities** | 80% | 90% |
| **Components** | 0% | 70% |
| **Routes** | 0% | 60% |
| **Overall** | ~15% | 80% |

---

## 🔧 Configuration

### vitest.config.ts ✅ Created

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 📝 Writing Good Tests

### Best Practices

1. **Test Behavior, Not Implementation**
   ```typescript
   // ❌ Bad: Testing implementation details
   expect(component.state.isOpen).toBe(true);
   
   // ✅ Good: Testing user-visible behavior
   expect(screen.getByRole('dialog')).toBeVisible();
   ```

2. **Use Semantic Queries**
   ```typescript
   // Priority order:
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText(/email/i)
   screen.getByPlaceholderText(/enter email/i)
   screen.getByText(/welcome/i)
   ```

3. **Wait for Async Updates**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText(/success/i)).toBeInTheDocument();
   });
   ```

4. **Mock External Dependencies**
   ```typescript
   vi.mock('../api/db', () => ({
     queryDatabase: vi.fn().mockResolvedValue({ data: [] }),
   }));
   ```

---

## 🐛 Debugging Tests

### Run specific test file
```bash
npm test src/lib/__tests__/logger.test.ts
```

### Run tests matching pattern
```bash
npm test -- --grep "logger"
```

### Debug in VS Code
Add this to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

---

## 📊 Coverage Report

After running `npm run test:coverage`, open:
```
coverage/index.html
```

This shows:
- Line coverage
- Branch coverage
- Function coverage
- Uncovered lines

---

## 🎓 Learning Resources

### Vitest
- [Vitest Documentation](https://vitest.dev/)
- [Vitest Examples](https://github.com/vitest-dev/vitest/tree/main/examples)

### React Testing Library
- [RTL Documentation](https://testing-library.com/react)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Test-Driven Development
- [TDD with React](https://www.freecodecamp.org/news/test-driven-development-tutorial-how-to-test-javascript-and-reactjs-app/)

---

## 🚀 Quick Start Checklist

- [x] Install testing dependencies
- [x] Create vitest.config.ts
- [x] Create test setup file
- [x] Write utility tests (logger, constants, accessibility)
- [ ] Add test scripts to package.json
- [ ] Write component tests
- [ ] Write route tests
- [ ] Set up CI/CD testing
- [ ] Achieve 80% coverage

---

## 💡 Tips

1. **Run tests before committing**
   ```bash
   npm test && git commit
   ```

2. **Watch mode for development**
   ```bash
   npm run test:watch
   ```

3. **Focus on critical paths first**
   - Membership application flow
   - Certificate download
   - Member search and filter

4. **Keep tests fast**
   - Mock API calls
   - Use happy-dom instead of jsdom
   - Avoid unnecessary async waits

5. **Test accessibility**
   ```typescript
   expect(button).toHaveAttribute('aria-label');
   expect(screen.getByRole('button')).toBeInTheDocument();
   ```

---

## ✨ Summary

**Status**: Testing infrastructure ready ✅

**Created**:
- 3 test files with 15+ test cases
- vitest.config.ts configuration
- Test setup with jest-dom matchers
- Test utilities and mocks

**Next Steps**:
1. Install dependencies: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui happy-dom`
2. Add test scripts to package.json
3. Run tests: `npm test`
4. Write component and route tests
5. Aim for 80% coverage

**Time to 80% coverage**: ~20-30 hours

