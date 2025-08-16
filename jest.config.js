/**
 * Jest Configuration for FoodVision AI
 * 
 * Configures testing environment for Node.js and browser environment simulation
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',
    
    // Setup files to run before tests
    setupFiles: ['<rootDir>/tests/setup.js'],
    
    // Test file patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],
    
    // Coverage configuration
    collectCoverageFrom: [
        'app.js',
        'server.js',
        '!node_modules/**',
        '!tests/**'
    ],
    
    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    
    // Module paths
    roots: ['<rootDir>'],
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Verbose output
    verbose: true,
    
    // Transform files
    transform: {},
    
    // Module name mapping
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    }
};

