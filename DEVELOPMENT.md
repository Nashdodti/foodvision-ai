# Development Guidelines 🛠️

> **FoodVision AI Development Standards and Best Practices**

This document outlines the development standards, coding conventions, and best practices for the FoodVision AI project.

## 📋 Table of Contents

- [Code Standards](#code-standards)
- [Naming Conventions](#naming-conventions)
- [Documentation](#documentation)
- [Error Handling](#error-handling)
- [Security Guidelines](#security-guidelines)
- [Testing Standards](#testing-standards)
- [Performance Guidelines](#performance-guidelines)
- [Git Workflow](#git-workflow)

## 🎯 Code Standards

### General Principles

1. **Readability First** - Code should be self-documenting and easy to understand
2. **Single Responsibility** - Each function/class should have one clear purpose
3. **DRY (Don't Repeat Yourself)** - Avoid code duplication
4. **Fail Fast** - Detect and handle errors early
5. **Defensive Programming** - Always validate inputs and handle edge cases

### JavaScript/ES6+ Standards

```javascript
// ✅ Good - Clear naming, proper documentation
/**
 * Analyzes food image using AI vision API
 * @param {string} imageData - Base64 encoded image
 * @returns {Promise<Object>} Analysis result with rating and details
 */
async function analyzeFoodImage(imageData) {
    if (!imageData) {
        throw new Error('Image data is required');
    }
    
    try {
        const result = await callVisionAPI(imageData);
        return validateAnalysisResult(result);
    } catch (error) {
        logger.error('Food analysis failed:', error);
        throw new Error('Analysis failed: ' + error.message);
    }
}

// ❌ Bad - Poor naming, no documentation, no error handling
function analyze(img) {
    return callAPI(img);
}
```

### HTML Standards

```html
<!-- ✅ Good - Semantic HTML, proper accessibility -->
<main class="food-analysis-container">
    <section class="camera-section" aria-label="Camera capture area">
        <h2 class="sr-only">Camera Interface</h2>
        <video id="camera" autoplay playsinline class="camera-feed"></video>
        <button id="capture-btn" class="capture-button" aria-label="Capture and analyze food">
            <i class="fas fa-camera" aria-hidden="true"></i>
            Capture & Analyze
        </button>
    </section>
</main>

<!-- ❌ Bad - Non-semantic, poor accessibility -->
<div class="container">
    <div class="camera">
        <video id="cam"></video>
        <button id="btn">Click</button>
    </div>
</div>
```

## 🏷️ Naming Conventions

### Variables and Functions

```javascript
// ✅ Good - Descriptive, camelCase
const cameraStream = await getUserMedia();
const isMobileDevice = detectMobileDevice();
const ratingSystemConfig = getRatingConfiguration();

function initializeCamera() { /* ... */ }
function handleCaptureAndAnalyze() { /* ... */ }
function updateRatingBadge() { /* ... */ }

// ❌ Bad - Unclear, inconsistent
const stream = await getMedia();
const mobile = isMobile();
const config = getConfig();

function init() { /* ... */ }
function capture() { /* ... */ }
function update() { /* ... */ }
```

### Classes and Constants

```javascript
// ✅ Good - PascalCase for classes, UPPER_SNAKE_CASE for constants
class FoodVisionApp {
    constructor() {
        this.API_ENDPOINTS = {
            CONFIG: '/api/config',
            TEST: '/api/test-perplexity'
        };
    }
}

// ❌ Bad - Inconsistent naming
class foodvisionapp {
    constructor() {
        this.apiEndpoints = {
            config: '/api/config',
            test: '/api/test-perplexity'
        };
    }
}
```

### CSS Classes

```css
/* ✅ Good - BEM methodology, descriptive */
.food-analysis__camera {
    position: relative;
}

.food-analysis__camera--mobile {
    height: 64vh;
}

.food-analysis__capture-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ❌ Bad - Unclear, inconsistent */
.camera {
    position: relative;
}

.cam-mobile {
    height: 64vh;
}

.btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 📚 Documentation

### JSDoc Standards

```javascript
/**
 * Main application class for FoodVision AI
 * Handles camera initialization, AI analysis, and UI interactions
 * 
 * @example
 * const app = new FoodVisionApp();
 * await app.initializeApplication();
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */
class FoodVisionApp {
    /**
     * Initialize the FoodVision application
     * Sets up camera, speech synthesis, and rating system configuration
     * 
     * @throws {Error} When required DOM elements are not found
     * @returns {Promise<void>}
     */
    async initializeApplication() {
        // Implementation
    }
    
    /**
     * Analyze image using Perplexity AI API
     * 
     * @param {string} imageData - Base64 encoded image data
     * @param {Object} options - Analysis options
     * @param {boolean} options.includeMetadata - Whether to include image metadata
     * @returns {Promise<AnalysisResult>} Analysis result with rating and details
     * 
     * @example
     * const result = await app.analyzeImageWithAI(imageData, {
     *   includeMetadata: true
     * });
     * console.log(result.rating); // 1-5
     */
    async analyzeImageWithAI(imageData, options = {}) {
        // Implementation
    }
}
```

### README Documentation

- **Clear project description** with purpose and goals
- **Installation instructions** with prerequisites
- **Usage examples** with screenshots
- **API documentation** for public methods
- **Troubleshooting guide** for common issues
- **Contributing guidelines** for developers

## ⚠️ Error Handling

### Error Handling Patterns

```javascript
// ✅ Good - Comprehensive error handling
async function processUserInput(userData) {
    // Input validation
    if (!userData || typeof userData !== 'object') {
        throw new ValidationError('User data must be a valid object');
    }
    
    try {
        // Business logic
        const result = await validateAndProcess(userData);
        return result;
    } catch (error) {
        // Log error for debugging
        logger.error('Processing failed:', {
            userData,
            error: error.message,
            stack: error.stack
        });
        
        // Re-throw with user-friendly message
        if (error instanceof ValidationError) {
            throw error;
        } else if (error.code === 'NETWORK_ERROR') {
            throw new UserFriendlyError('Network connection failed. Please try again.');
        } else {
            throw new UserFriendlyError('An unexpected error occurred. Please contact support.');
        }
    }
}

// ❌ Bad - No error handling
function processUserInput(userData) {
    return validateAndProcess(userData);
}
```

### Error Types

```javascript
// Custom error classes
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class UserFriendlyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserFriendlyError';
        this.userFriendly = true;
    }
}
```

## 🔒 Security Guidelines

### Input Validation

```javascript
// ✅ Good - Comprehensive input validation
function sanitizeUserInput(input) {
    if (typeof input !== 'string') {
        throw new ValidationError('Input must be a string');
    }
    
    // Remove potentially dangerous content
    const sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    
    if (sanitized.length > 1000) {
        throw new ValidationError('Input too long');
    }
    
    return sanitized;
}

// ❌ Bad - No validation
function processInput(input) {
    return input; // Dangerous!
}
```

### API Key Security

```javascript
// ✅ Good - Secure API key handling
class SecureAPIClient {
    constructor() {
        // Never log API keys
        this.apiKey = process.env.PERPLEXITY_API_KEY;
        
        if (!this.apiKey || this.apiKey === 'placeholder') {
            throw new Error('API key not configured');
        }
    }
    
    async makeRequest(data) {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return response.json();
    }
}
```

## 🧪 Testing Standards

### Test Structure (AAA Pattern)

```javascript
describe('FoodVisionApp', () => {
    describe('analyzeImageWithAI', () => {
        test('should return valid analysis result', async () => {
            // Arrange
            const app = new FoodVisionApp();
            const mockImageData = 'data:image/jpeg;base64,mock-data';
            const expectedRating = 3;
            
            // Mock API response
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                rating: expectedRating,
                                pros: ['Good taste'],
                                cons: ['Could be better']
                            })
                        }
                    }]
                })
            });
            
            // Act
            const result = await app.analyzeImageWithAI(mockImageData);
            
            // Assert
            expect(result.rating).toBe(expectedRating);
            expect(result.pros).toHaveLength(1);
            expect(result.cons).toHaveLength(1);
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/analyze'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            );
        });
        
        test('should handle API errors gracefully', async () => {
            // Arrange
            const app = new FoodVisionApp();
            const mockImageData = 'data:image/jpeg;base64,mock-data';
            
            global.fetch = jest.fn().mockRejectedValue(
                new Error('Network error')
            );
            
            // Act & Assert
            await expect(app.analyzeImageWithAI(mockImageData))
                .rejects
                .toThrow('Analysis failed: Network error');
        });
    });
});
```

### Test Coverage Requirements

- **Minimum 80% code coverage**
- **100% coverage for critical functions**
- **Test all error paths**
- **Mock external dependencies**

## ⚡ Performance Guidelines

### Optimization Techniques

```javascript
// ✅ Good - Performance optimized
class OptimizedApp {
    constructor() {
        // Cache DOM elements
        this.cachedElements = new Map();
        this.debounceTimers = new Map();
    }
    
    getElement(id) {
        if (!this.cachedElements.has(id)) {
            this.cachedElements.set(id, document.getElementById(id));
        }
        return this.cachedElements.get(id);
    }
    
    // Debounced function for performance
    debouncedUpdate = this.debounce((data) => {
        this.updateUI(data);
    }, 100);
    
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimers.get(func));
            this.debounceTimers.set(func, setTimeout(() => func(...args), wait));
        };
    }
}

// ❌ Bad - Performance issues
class UnoptimizedApp {
    updateUI(data) {
        // Always query DOM
        document.getElementById('element1').textContent = data.value1;
        document.getElementById('element2').textContent = data.value2;
        document.getElementById('element3').textContent = data.value3;
    }
}
```

### Memory Management

```javascript
// ✅ Good - Proper cleanup
class CameraManager {
    constructor() {
        this.stream = null;
        this.videoElement = null;
    }
    
    async initializeCamera() {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.videoElement = document.getElementById('camera');
        this.videoElement.srcObject = this.stream;
    }
    
    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }
}
```

## 🔄 Git Workflow

### Commit Message Standards

```bash
# ✅ Good - Conventional commits
feat: add mobile camera optimization
fix: resolve camera permission issues on iOS
docs: update API documentation
test: add unit tests for image analysis
refactor: improve error handling in API client
style: format code with prettier
perf: optimize image capture performance
chore: update dependencies

# ❌ Bad - Unclear messages
fixed stuff
updated
wip
```

### Branch Naming

```bash
# ✅ Good - Descriptive branch names
feature/mobile-camera-optimization
bugfix/camera-permission-ios
hotfix/security-vulnerability
refactor/api-client-improvements

# ❌ Bad - Unclear branch names
feature1
bugfix
test
```

### Pull Request Standards

1. **Clear title** describing the change
2. **Detailed description** with context and motivation
3. **Screenshots** for UI changes
4. **Test coverage** information
5. **Breaking changes** clearly marked
6. **Checklist** of completed tasks

## 📋 Code Review Checklist

### Before Submitting

- [ ] Code follows naming conventions
- [ ] Functions are properly documented
- [ ] Error handling is implemented
- [ ] Tests are written and passing
- [ ] No console.log statements in production code
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Code is formatted with Prettier
- [ ] ESLint passes without errors

### During Review

- [ ] Code is readable and maintainable
- [ ] Logic is correct and efficient
- [ ] Edge cases are handled
- [ ] Security vulnerabilities are addressed
- [ ] Tests cover all scenarios
- [ ] Documentation is updated
- [ ] No breaking changes introduced

## 🎯 Quality Metrics

### Code Quality Targets

- **Cyclomatic Complexity**: < 10 per function
- **Lines of Code**: < 50 per function
- **Test Coverage**: > 80%
- **ESLint Score**: 0 errors, < 5 warnings
- **Performance**: < 3s load time
- **Accessibility**: WCAG 2.1 AA compliant

### Monitoring Tools

- **ESLint** for code quality
- **Prettier** for formatting
- **Jest** for testing
- **Lighthouse** for performance
- **axe-core** for accessibility

---

**Remember**: These guidelines are living documents. They should evolve with the project and team needs. Always prioritize code quality, security, and maintainability over speed.
