/**
 * Jest Test Setup
 * 
 * Global setup for Jest tests - mocks browser environment
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */

// Mock fetch globally
global.fetch = jest.fn();

// Mock navigator.mediaDevices
global.navigator = {
    mediaDevices: {
        getUserMedia: jest.fn()
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

// Mock speech synthesis
global.speechSynthesis = {
    speaking: false,
    cancel: jest.fn(),
    speak: jest.fn()
};

// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
    text,
    rate: 1,
    pitch: 1,
    volume: 1
}));

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    drawImage: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn()
}));

HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/jpeg;base64,mock-image-data');

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
};

// Mock setTimeout and setInterval
jest.useFakeTimers();
