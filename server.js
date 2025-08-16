/**
 * FoodVision AI Server
 * 
 * Express server for FoodVision AI application with secure API key handling
 * and HTTPS support for mobile camera access.
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */

const express = require('express');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

// Configuration constants
const CONFIG = {
    HTTP_PORT: process.env.PORT || 8000,
    HTTPS_PORT: process.env.HTTPS_PORT || 8443,
    SSL_CERT_PATH: {
        KEY: `${__dirname  }/localhost-key.pem`,
        CERT: `${__dirname  }/localhost.pem`
    },
    API_ENDPOINTS: {
        CONFIG: '/api/config',
        TEST_PERPLEXITY: '/api/test-perplexity',
        TEST_GEMINI: '/api/test-gemini',
        ANALYZE: '/api/analyze'
    }
};

// Initialize Express application
const app = express();

/**
 * Middleware configuration
 */
function configureMiddleware() {
    // Parse JSON bodies
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Serve static files with security headers
    app.use(express.static('.', {
        setHeaders: (res, path) => {
            // Security headers
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
        }
    }));
    
    // Request logging middleware
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

/**
 * API route handlers
 */
function setupAPIRoutes() {
    // API endpoint to get API configuration (for client-side use)
    app.get(CONFIG.API_ENDPOINTS.CONFIG, (req, res) => {
        try {
            const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
            const geminiApiKey = process.env.GEMINI_API_KEY;
            const defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'gemini';
            
            res.json({
                perplexityApiKey: perplexityApiKey,
                geminiApiKey: geminiApiKey,
                defaultProvider: defaultProvider
            });
        } catch (error) {
            console.error('Error serving API config:', error);
            res.status(500).json({ 
                error: 'Internal server error',
                message: 'Failed to retrieve API configuration'
            });
        }
    });

    // Test endpoint to verify Perplexity API key works
    app.get(CONFIG.API_ENDPOINTS.TEST_PERPLEXITY, async (req, res) => {
        try {
            const apiKey = process.env.PERPLEXITY_API_KEY;
            
            if (!isValidAPIKey(apiKey)) {
                return res.status(400).json({ 
                    error: 'API key not configured',
                    message: 'Please set a valid Perplexity API key in environment variables'
                });
            }

            const testResponse = await testPerplexityAPI(apiKey);
            res.json(testResponse);
        } catch (error) {
            console.error('Perplexity API test failed:', error);
            res.status(500).json({ 
                error: 'API test failed', 
                message: error.message 
            });
        }
    });

    // Test endpoint to verify Gemini API key works
    app.get(CONFIG.API_ENDPOINTS.TEST_GEMINI, async (req, res) => {
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            
            if (!isValidGeminiAPIKey(apiKey)) {
                return res.status(400).json({ 
                    error: 'API key not configured',
                    message: 'Please set a valid Gemini API key in environment variables'
                });
            }

            const testResponse = await testGeminiAPI(apiKey);
            res.json(testResponse);
        } catch (error) {
            console.error('Gemini API test failed:', error);
            res.status(500).json({ 
                error: 'API test failed', 
                message: error.message 
            });
        }
    });

    // Analysis endpoint for image processing
    app.post(CONFIG.API_ENDPOINTS.ANALYZE, async (req, res) => {
        try {
            const { imageData, provider = 'gemini' } = req.body;
            
            if (!imageData) {
                return res.status(400).json({ 
                    error: 'Missing image data',
                    message: 'Image data is required for analysis'
                });
            }

            let analysisResult;
            if (provider === 'gemini') {
                const apiKey = process.env.GEMINI_API_KEY;
                if (!isValidGeminiAPIKey(apiKey)) {
                    return res.status(400).json({ 
                        error: 'Gemini API key not configured',
                        message: 'Please set a valid Gemini API key in environment variables'
                    });
                }
                analysisResult = await analyzeWithGemini(imageData, apiKey);
            } else {
                const apiKey = process.env.PERPLEXITY_API_KEY;
                if (!isValidAPIKey(apiKey)) {
                    return res.status(400).json({ 
                        error: 'Perplexity API key not configured',
                        message: 'Please set a valid Perplexity API key in environment variables'
                    });
                }
                analysisResult = await analyzeWithPerplexity(imageData, apiKey);
            }

            res.json(analysisResult);
        } catch (error) {
            console.error('Analysis failed:', error);
            res.status(500).json({ 
                error: 'Analysis failed', 
                message: error.message 
            });
        }
    });

    // Serve the main page
    app.get('/', (req, res) => {
        try {
            res.sendFile(`${__dirname  }/index.html`);
        } catch (error) {
            console.error('Error serving main page:', error);
            res.status(500).send('Internal server error');
        }
    });

    // 404 handler for undefined routes
    app.use('*', (req, res) => {
        res.status(404).json({
            error: 'Not found',
            message: `Route ${req.originalUrl} not found`
        });
    });
}

/**
 * Validate Perplexity API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAPIKey(apiKey) {
    return apiKey && 
           apiKey !== 'pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' && 
           apiKey.startsWith('pplx-') &&
           apiKey.length > 20;
}

/**
 * Validate Gemini API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidGeminiAPIKey(apiKey) {
    return apiKey && 
           apiKey.startsWith('AIza') &&
           apiKey.length > 20;
}

/**
 * Test Perplexity API connectivity
 * @param {string} apiKey - Valid API key
 * @returns {Promise<Object>} Test result
 */
async function testPerplexityAPI(apiKey) {
    const testRequestBody = {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
            {
                role: 'user',
                content: 'Hello, this is a test message.'
            }
        ],
        max_tokens: 10
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testRequestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        
        // Check if it's a model error
        if (errorText.includes('Invalid model')) {
            return { 
                success: false, 
                message: 'API key is valid but model is not available',
                details: 'The specified Perplexity model is not currently available. Please check the documentation for the correct model name.'
            };
        }
        
        throw new Error(`API test failed: ${response.status} - ${errorText}`);
    }

    return { 
        success: true, 
        message: 'Perplexity API key is valid and working' 
    };
}

/**
 * Test Gemini API connectivity
 * @param {string} apiKey - Valid API key
 * @returns {Promise<Object>} Test result
 */
async function testGeminiAPI(apiKey) {
    const testRequestBody = {
        contents: [{
            parts: [{
                text: 'Hello, this is a test message.'
            }]
        }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testRequestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API test failed: ${response.status} - ${errorText}`);
    }

    return { 
        success: true, 
        message: 'Gemini API key is valid and working' 
    };
}

/**
 * Analyze image using Gemini Vision API
 * @param {string} imageData - Base64 encoded image
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeWithGemini(imageData, apiKey) {
    const prompt = `YOU ARE A STRICT FOOD DETECTOR. YOUR MISSION: ONLY ANALYZE ACTUAL FOOD.

🚨 CRITICAL RULES:
1. FOOD = visible prepared dishes, meals, fruits, vegetables, baked goods, cooked items
2. NOT FOOD = people, hands, faces, phones, utensils, empty plates, cups, bottles, packaging, raw ingredients alone, tables, backgrounds

🔍 DETECTION PROCESS:
STEP 1: Scan the image carefully
STEP 2: Ask yourself: "Can I see actual prepared FOOD that someone would eat?"
STEP 3: If you see ONLY non-food items (people, objects, empty dishes), respond with NO FOOD
STEP 4: If you see actual FOOD, identify it precisely and rate it

❌ RESPOND WITH "NO FOOD" IF YOU SEE:
- People holding phones/objects
- Empty plates or utensils
- Just hands or faces
- Bottles, cups, or containers
- Non-food objects
- Unclear or blurry images

✅ ONLY ANALYZE IF YOU SEE:
- Actual prepared food dishes
- Meals ready to eat
- Clear food items

RESPONSE FORMAT:

If NO FOOD detected:
{
  "foodDetected": false,
  "message": "No food detected. Please take a photo showing actual food items like prepared dishes, meals, or food ready to eat."
}

If FOOD detected:
{
  "foodDetected": true,
  "foodName": "Specific name of the food dish",
  "rating": [1-5],
  "score": [0-100],
  "analysis": "Brief analysis of the actual food visible",
  "pros": ["What looks good about the food"],
  "cons": ["Areas for improvement"],
  "recommendations": ["Suggestions for the food"]
}

RATING SCALE (1-5):
1 = Premium (exceptional quality and presentation)
2 = High Standard (very good with minor improvements)
3 = Standard (acceptable with room for improvement)
4 = Improvement Needed (below average)
5 = Poor (unacceptable quality)

🎯 BE STRICT: Only analyze if you see clear, identifiable FOOD items!`;

    const requestBody = {
        contents: [{
            parts: [
                {
                    text: prompt
                },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
                    }
                }
            ]
        }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Log the raw AI response for debugging
    const analysisText = result.candidates[0].content.parts[0].text;
    console.log('🔍 Raw AI Response:', analysisText);
    
    try {
        // Try to parse the response as JSON
        const analysisMatch = analysisText.match(/\{[\s\S]*\}/);
        
        if (analysisMatch) {
            const parsedResult = JSON.parse(analysisMatch[0]);
            console.log('✅ Parsed AI Response:', parsedResult);
            
            // Check if food detection is working
            if (parsedResult.foodDetected === false) {
                console.log('🚫 AI correctly detected: NO FOOD');
                return parsedResult;
            } else if (parsedResult.foodDetected === true) {
                console.log('✅ AI detected food:', parsedResult.foodName);
                return parsedResult;
            } else {
                console.log('⚠️ AI response missing foodDetected field, treating as no food');
                return {
                    foodDetected: false,
                    message: "Unable to determine if food is present. Please take a clear photo of food items."
                };
            }
        } else {
            console.log('⚠️ No JSON found in AI response, treating as no food');
            return {
                foodDetected: false,
                message: "Unable to analyze image. Please take a clear photo of food items."
            };
        }
    } catch (error) {
        console.error('❌ Failed to parse Gemini response:', error);
        return {
            foodDetected: false,
            message: "Error analyzing image. Please try again with a clear photo of food items."
        };
    }
}

/**
 * Analyze image using Perplexity API
 * @param {string} imageData - Base64 encoded image
 * @param {string} apiKey - Perplexity API key
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeWithPerplexity(imageData, apiKey) {
    const prompt = `YOU ARE A STRICT FOOD DETECTOR. YOUR MISSION: ONLY ANALYZE ACTUAL FOOD.

🚨 CRITICAL RULES:
1. FOOD = visible prepared dishes, meals, fruits, vegetables, baked goods, cooked items
2. NOT FOOD = people, hands, faces, phones, utensils, empty plates, cups, bottles, packaging, raw ingredients alone, tables, backgrounds

🔍 DETECTION PROCESS:
STEP 1: Scan the image carefully
STEP 2: Ask yourself: "Can I see actual prepared FOOD that someone would eat?"
STEP 3: If you see ONLY non-food items (people, objects, empty dishes), respond with NO FOOD
STEP 4: If you see actual FOOD, identify it precisely and rate it

❌ RESPOND WITH "NO FOOD" IF YOU SEE:
- People holding phones/objects
- Empty plates or utensils
- Just hands or faces
- Bottles, cups, or containers
- Non-food objects
- Unclear or blurry images

✅ ONLY ANALYZE IF YOU SEE:
- Actual prepared food dishes
- Meals ready to eat
- Clear food items

RESPONSE FORMAT:

If NO FOOD detected:
{
  "foodDetected": false,
  "message": "No food detected. Please take a photo showing actual food items like prepared dishes, meals, or food ready to eat."
}

If FOOD detected:
{
  "foodDetected": true,
  "foodName": "Specific name of the food dish",
  "rating": [1-5],
  "score": [0-100],
  "analysis": "Brief analysis of the actual food visible",
  "pros": ["What looks good about the food"],
  "cons": ["Areas for improvement"],
  "recommendations": ["Suggestions for the food"]
}

RATING SCALE (1-5):
1 = Premium (exceptional quality and presentation)
2 = High Standard (very good with minor improvements)
3 = Standard (acceptable with room for improvement)
4 = Improvement Needed (below average)
5 = Poor (unacceptable quality)

🎯 BE STRICT: Only analyze if you see clear, identifiable FOOD items!`;

    const requestBody = {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: prompt
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageData
                        }
                    }
                ]
            }
        ],
        max_tokens: 1000
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Perplexity API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Log the raw AI response for debugging
    const analysisText = result.choices[0].message.content;
    console.log('🔍 Raw Perplexity Response:', analysisText);
    
    try {
        // Try to parse the response as JSON
        const analysisMatch = analysisText.match(/\{[\s\S]*\}/);
        
        if (analysisMatch) {
            const parsedResult = JSON.parse(analysisMatch[0]);
            console.log('✅ Parsed Perplexity Response:', parsedResult);
            
            // Check if food detection is working
            if (parsedResult.foodDetected === false) {
                console.log('🚫 Perplexity correctly detected: NO FOOD');
                return parsedResult;
            } else if (parsedResult.foodDetected === true) {
                console.log('✅ Perplexity detected food:', parsedResult.foodName);
                return parsedResult;
            } else {
                console.log('⚠️ Perplexity response missing foodDetected field, treating as no food');
                return {
                    foodDetected: false,
                    message: "Unable to determine if food is present. Please take a clear photo of food items."
                };
            }
        } else {
            console.log('⚠️ No JSON found in Perplexity response, treating as no food');
            return {
                foodDetected: false,
                message: "Unable to analyze image. Please take a clear photo of food items."
            };
        }
    } catch (error) {
        console.error('❌ Failed to parse Perplexity response:', error);
        return {
            foodDetected: false,
            message: "Error analyzing image. Please try again with a clear photo of food items."
        };
    }
}



/**
 * Create and start HTTP server
 */
function startHTTPServer() {
    app.listen(CONFIG.HTTP_PORT, () => {
        console.log(`🚀 FoodVision AI HTTP server running on http://localhost:${CONFIG.HTTP_PORT}`);
        console.log(`🔒 HTTPS server running on https://localhost:${CONFIG.HTTPS_PORT}`);
        console.log('📱 For mobile camera access, use the HTTPS URL');
        console.log('🔐 API key loaded from environment variables');
    });
}

/**
 * Create and start HTTPS server for mobile camera access
 */
function startHTTPSServer() {
    try {
        // Check if SSL certificates exist
        if (!fs.existsSync(CONFIG.SSL_CERT_PATH.KEY) || !fs.existsSync(CONFIG.SSL_CERT_PATH.CERT)) {
            console.log('⚠️  SSL certificates not found - HTTPS server not started');
            console.log('📱 Run ./generate-cert.sh to create SSL certificates for mobile access');
            return;
        }

        const sslOptions = {
            key: fs.readFileSync(CONFIG.SSL_CERT_PATH.KEY),
            cert: fs.readFileSync(CONFIG.SSL_CERT_PATH.CERT)
        };
        
        https.createServer(sslOptions, app).listen(CONFIG.HTTPS_PORT, () => {
            console.log(`🔒 HTTPS server running on https://localhost:${CONFIG.HTTPS_PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start HTTPS server:', error.message);
        console.log('📱 Mobile camera access may not work without HTTPS');
    }
}

/**
 * Initialize and start the server
 */
function initializeServer() {
    try {
        configureMiddleware();
        setupAPIRoutes();
        startHTTPServer();
        startHTTPSServer();
        
        console.log('✅ FoodVision AI server initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize server:', error);
        process.exit(1);
    }
}

// Start the server
initializeServer();
