/**
 * ESLint Configuration for FoodVision AI
 * 
 * Enforces code quality, consistency, and best practices
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'prettier'
    ],
    plugins: [
        'jest'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Code Quality
        'complexity': ['error', 10],
        'max-depth': ['error', 4],
        'max-lines': ['error', 300],
        'max-lines-per-function': ['error', 50],
        'max-params': ['error', 4],
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-alert': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',

        // Best Practices
        'curly': ['error', 'all'],
        'eqeqeq': ['error', 'always'],
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-template': 'error',
        'no-useless-concat': 'error',
        'no-useless-return': 'error',
        'no-unused-expressions': 'error',
        'no-duplicate-imports': 'error',
        'no-useless-rename': 'error',

        // Error Handling
        'no-throw-literal': 'error',
        'prefer-promise-reject-errors': 'error',

        // Documentation
        'valid-jsdoc': ['warn', {
            requireReturn: false,
            requireReturnDescription: false,
            requireParamDescription: false
        }],

        // Jest Rules
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',

        // Styling (will be handled by Prettier)
        'indent': 'off',
        'quotes': 'off',
        'semi': 'off',
        'comma-dangle': 'off',
        'object-curly-spacing': 'off',
        'array-bracket-spacing': 'off'
    },
    overrides: [
        {
            // Test files
            files: ['**/*.test.js', '**/*.spec.js'],
            env: {
                jest: true
            },
            rules: {
                'no-console': 'off',
                'max-lines-per-function': 'off'
            }
        },
        {
            // Server files
            files: ['server.js'],
            env: {
                node: true
            },
            rules: {
                'no-console': 'off'
            }
        }
    ]
};
