/**
 * FoodVision AI Application Tests
 * 
 * Unit tests for the main application functionality
 * Following Arrange-Act-Assert pattern
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */

// Mock DOM elements for testing
const mockDOM = {
    'capture-btn': { addEventListener: jest.fn() },
    'enable-camera-btn': { addEventListener: jest.fn() },
    'camera': { srcObject: null, videoWidth: 1280, videoHeight: 720 },
    'camera-overlay': { classList: { add: jest.fn() } },
    'loading': { classList: { remove: jest.fn(), add: jest.fn() } },
    'initial-state': { classList: { add: jest.fn() } },
    'rating-section': { classList: { remove: jest.fn() } },
    'stats-section': { classList: { remove: jest.fn() } },
    'pros-section': { classList: { remove: jest.fn() } },
    'cons-section': { classList: { remove: jest.fn() } },
    'rating-badge': { className: '', innerHTML: '' },
    'pros-list': { innerHTML: '' },
    'cons-list': { innerHTML: '' },
    'pros-count': { textContent: '' },
    'cons-count': { textContent: '' }
};

// Override document methods for testing
document.getElementById = jest.fn((id) => mockDOM[id]);
document.createElement = jest.fn(() => ({ 
    className: '', 
    innerHTML: '', 
    appendChild: jest.fn(),
    remove: jest.fn(),
    textContent: '',
    style: {},
    offsetHeight: 0
}));

// Override navigator for mobile testing
navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';

// Import the application
const { FoodVisionApp } = require('../app.js');

describe('FoodVision AI Application', () => {
    let app;

    beforeEach(() => {
        // Arrange: Reset all mocks before each test
        jest.clearAllMocks();
        app = new FoodVisionApp();
    });

    describe('Initialization', () => {
        test('should initialize application successfully', () => {
            // Arrange
            const expectedElements = ['capture-btn', 'enable-camera-btn'];
            
            // Act
            app.initializeApplication();
            
            // Assert
            expect(app.isInitialized).toBe(true);
            expectedElements.forEach(elementId => {
                expect(document.getElementById).toHaveBeenCalledWith(elementId);
            });
        });

        test('should throw error when required elements not found', () => {
            // Arrange
            document.getElementById.mockReturnValue(null);
            
            // Act & Assert
            expect(() => app.setupEventListeners()).toThrow('Required UI elements not found');
        });
    });

    describe('Camera Detection', () => {
        test('should detect mobile device correctly', () => {
            // Arrange
            const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
            navigator.userAgent = mobileUserAgent;
            
            // Act
            const isMobile = app.detectMobileDevice();
            
            // Assert
            expect(isMobile).toBe(true);
        });

        test('should detect desktop device correctly', () => {
            // Arrange
            const desktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
            navigator.userAgent = desktopUserAgent;
            
            // Act
            const isMobile = app.detectMobileDevice();
            
            // Assert
            expect(isMobile).toBe(false);
        });
    });

    describe('Camera Constraints', () => {
        test('should return mobile camera constraints', () => {
            // Arrange
            const isMobile = true;
            
            // Act
            const constraints = app.getCameraConstraints(isMobile);
            
            // Assert
            expect(constraints.video.facingMode).toBe('environment');
            expect(constraints.video.width.ideal).toBe(1280);
            expect(constraints.video.height.ideal).toBe(720);
        });

        test('should return desktop camera constraints', () => {
            // Arrange
            const isMobile = false;
            
            // Act
            const constraints = app.getCameraConstraints(isMobile);
            
            // Assert
            expect(constraints.video.facingMode).toBe('user');
            expect(constraints.video.width.ideal).toBe(1280);
            expect(constraints.video.height.ideal).toBe(720);
        });
    });

    describe('API Key Validation', () => {
        test('should validate correct API key format', () => {
            // Arrange
            const validApiKey = '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';
            
            // Act
            const isValid = app.isValidAPIKey(validApiKey);
            
            // Assert
            expect(isValid).toBe(true);
        });

        test('should reject placeholder API key', () => {
            // Arrange
            const placeholderKey = 'pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
            
            // Act
            const isValid = app.isValidAPIKey(placeholderKey);
            
            // Assert
            expect(isValid).toBe(false);
        });

        test('should reject invalid API key format', () => {
            // Arrange
            const invalidKey = 'invalid-key-format';
            
            // Act
            const isValid = app.isValidAPIKey(invalidKey);
            
            // Assert
            expect(isValid).toBe(false);
        });
    });

    describe('Text Sanitization', () => {
        test('should sanitize text to prevent XSS', () => {
            // Arrange
            const maliciousText = '<script>alert("xss")</script>Hello World';
            
            // Act
            const sanitized = app.sanitizeText(maliciousText);
            
            // Assert
            expect(sanitized).not.toContain('<script>');
            expect(sanitized).toContain('Hello World');
        });

        test('should handle null and undefined text', () => {
            // Arrange
            const nullText = null;
            const undefinedText = undefined;
            
            // Act
            const nullResult = app.sanitizeText(nullText);
            const undefinedResult = app.sanitizeText(undefinedText);
            
            // Assert
            expect(nullResult).toBe('');
            expect(undefinedResult).toBe('');
        });
    });

    describe('Rating System', () => {
        test('should have all required rating levels', () => {
            // Arrange
            const expectedRatings = [1, 2, 3, 4, 5];
            
            // Act
            const actualRatings = Object.keys(app.ratingSystemConfig).map(Number);
            
            // Assert
            expectedRatings.forEach(rating => {
                expect(actualRatings).toContain(rating);
                expect(app.ratingSystemConfig[rating]).toHaveProperty('name');
                expect(app.ratingSystemConfig[rating]).toHaveProperty('color');
                expect(app.ratingSystemConfig[rating]).toHaveProperty('icon');
            });
        });

        test('should return correct rating configuration', () => {
            // Arrange
            const rating = 1;
            
            // Act
            const config = app.ratingSystemConfig[rating];
            
            // Assert
            expect(config.name).toBe('Premium');
            expect(config.color).toBe('bg-green-500');
            expect(config.icon).toBe('fas fa-trophy');
        });
    });

    describe('Error Handling', () => {
        test('should handle camera initialization errors gracefully', async () => {
            // Arrange
            const error = new Error('Camera access denied');
            navigator.mediaDevices.getUserMedia.mockRejectedValue(error);
            
            // Act
            await app.handleCameraInitialization();
            
            // Assert
            expect(app.showCameraErrorNotification).toHaveBeenCalledWith(error);
        });

        test('should handle API request failures', async () => {
            // Arrange
            fetch.mockRejectedValue(new Error('Network error'));
            
            // Act
            await app.handleCaptureAndAnalyze();
            
            // Assert
            expect(app.showErrorNotification).toHaveBeenCalledWith(
                expect.stringContaining('Analysis failed')
            );
        });
    });

    describe('Performance', () => {
        test('should not create unnecessary DOM elements', () => {
            // Arrange
            const initialCreateElementCalls = document.createElement.mock.calls.length;
            
            // Act
            app.showSuccessAnimation();
            
            // Assert
            expect(document.createElement.mock.calls).toHaveLength(initialCreateElementCalls + 1);
        });

        test('should clean up animations after timeout', () => {
            // Arrange
            const spy = jest.spyOn(global, 'setTimeout');
            
            // Act
            app.showSuccessAnimation();
            
            // Assert
            expect(spy).toHaveBeenCalledWith(expect.any(Function), 3000);
            
            spy.mockRestore();
        });
    });
});
