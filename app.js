/**
 * FoodVision AI - Intelligent Food Analysis Application
 * 
 * This application provides AI-powered food analysis using camera capture
 * and Perplexity Vision API integration with voice feedback.
 * 
 * @author FoodVision AI Team
 * @version 1.0.0
 */

/**
 * Main application class for FoodVision AI
 * Handles camera initialization, AI analysis, and UI interactions
 */
class FoodVisionApp {
    /**
     * Initialize the FoodVision application
     * Sets up camera, speech synthesis, and rating system configuration
     */
    constructor() {
        this.camera = null;
        this.cameraStream = null;
        this.speechSynthesis = window.speechSynthesis;
        this.isInitialized = false;
        
        // Rating system configuration with clear naming
        this.ratingSystemConfig = {
            1: { 
                name: 'Premium', 
                color: 'bg-gradient-to-r from-green-500 to-green-600', 
                icon: 'fas fa-trophy',
                description: 'Exceptional quality, presentation, and taste'
            },
            2: { 
                name: 'High Standard', 
                color: 'bg-gradient-to-r from-blue-500 to-blue-600', 
                icon: 'fas fa-medal',
                description: 'Very good quality with minor improvements possible'
            },
            3: { 
                name: 'Standard', 
                color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', 
                icon: 'fas fa-star',
                description: 'Acceptable quality with room for improvement'
            },
            4: { 
                name: 'Improvement Needed', 
                color: 'bg-gradient-to-r from-orange-500 to-orange-600', 
                icon: 'fas fa-exclamation-triangle',
                description: 'Below average with significant issues'
            },
            5: { 
                name: 'Poor', 
                color: 'bg-gradient-to-r from-red-500 to-red-600', 
                icon: 'fas fa-times-circle',
                description: 'Unacceptable quality with major problems'
            }
        };
        
        this.initializeApplication();
    }

    /**
     * Initialize the application and set up event listeners
     */
    async initializeApplication() {
        try {
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('FoodVision AI application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showErrorNotification('Application initialization failed');
        }
    }

    /**
     * Set up all event listeners for user interactions
     */
    setupEventListeners() {
        const captureButton = document.getElementById('capture-btn');
        const enableCameraButton = document.getElementById('enable-camera-btn');
        
        if (!captureButton || !enableCameraButton) {
            throw new Error('Required UI elements not found');
        }
        
        captureButton.addEventListener('click', () => this.handleCaptureAndAnalyze());
        enableCameraButton.addEventListener('click', () => this.handleCameraInitialization());
    }

    /**
     * Handle camera initialization with proper error handling
     */
    async handleCameraInitialization() {
        const overlay = document.getElementById('camera-overlay');
        const enableButton = document.getElementById('enable-camera-btn');
        
        if (!overlay || !enableButton) {
            this.showErrorNotification('Camera UI elements not found');
            return;
        }
        
        this.updateButtonState(enableButton, 'loading', 'Requesting Access...');
        
        try {
            await this.initializeCamera();
            this.hideCameraOverlay(overlay);
            this.showSuccessNotification('Camera Ready!', 'You can now capture and analyze food');
        } catch (error) {
            console.error('Camera initialization failed:', error);
            this.updateButtonState(enableButton, 'error', 'Enable Camera');
            this.showCameraErrorNotification(error);
        }
    }

    /**
     * Initialize camera with mobile-optimized settings
     * @returns {Promise<void>}
     */
    async initializeCamera() {
        // Enhanced debugging for live deployment
        console.log('🔍 Starting camera initialization...');
        console.log('🌐 Current URL:', window.location.href);
        console.log('🔒 Is HTTPS:', window.location.protocol === 'https:');
        console.log('📱 User Agent:', navigator.userAgent);
        
        // Validate browser support
        if (!this.isCameraSupported()) {
            console.error('❌ Camera API not supported');
            throw new Error('Camera API not supported in this browser');
        }
        
        console.log('✅ Camera API is supported');
        
        // Check if we're on HTTPS (required for camera access)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            console.error('❌ HTTPS required for camera access');
            throw new Error('HTTPS is required for camera access. Please use https://');
        }
        
        const isMobileDevice = this.detectMobileDevice();
        const cameraConstraints = this.getCameraConstraints(isMobileDevice);
        
        console.log('📋 Camera constraints:', cameraConstraints);
        console.log('📱 Is mobile device:', isMobileDevice);
        
        try {
            console.log('🎥 Requesting camera access...');
            this.cameraStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
            console.log('✅ Camera stream obtained');
        } catch (error) {
            console.error('❌ Camera access failed:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            throw error;
        }
        
        this.camera = document.getElementById('camera');
        
        if (!this.camera) {
            console.error('❌ Camera video element not found');
            throw new Error('Camera video element not found');
        }
        
        console.log('📹 Setting camera stream to video element');
        this.camera.srcObject = this.cameraStream;
        
        // Wait for video to load with timeout
        await this.waitForVideoLoad();
        
        console.log('🎉 Camera initialized successfully');
    }

    /**
     * Check if camera API is supported in the current browser
     * @returns {boolean}
     */
    isCameraSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * Detect if the current device is mobile
     * @returns {boolean}
     */
    detectMobileDevice() {
        const mobileUserAgents = [
            'Android', 'webOS', 'iPhone', 'iPad', 'iPod', 
            'BlackBerry', 'IEMobile', 'Opera Mini'
        ];
        return mobileUserAgents.some(agent => 
            navigator.userAgent.includes(agent)
        );
    }

    /**
     * Get camera constraints based on device type
     * @param {boolean} isMobile - Whether the device is mobile
     * @returns {Object} Camera constraints
     */
    getCameraConstraints(isMobile) {
        return {
            video: {
                facingMode: isMobile ? 'environment' : 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
    }

    /**
     * Wait for video element to load with timeout
     * @returns {Promise<void>}
     */
    async waitForVideoLoad() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Camera initialization timeout'));
            }, 5000);
            
            this.camera.onloadedmetadata = () => {
                clearTimeout(timeout);
                resolve();
            };
            
            this.camera.onerror = (error) => {
                clearTimeout(timeout);
                reject(error);
            };
        });
    }

    /**
     * Handle capture and analysis workflow
     */
    async handleCaptureAndAnalyze() {
        const captureButton = document.getElementById('capture-btn');
        const loadingElement = document.getElementById('loading');
        
        if (!captureButton || !loadingElement) {
            this.showErrorNotification('UI elements not found');
            return;
        }
        
        this.updateButtonState(captureButton, 'loading', 'Processing...');
        this.showLoadingState(loadingElement);
        
        try {
            const imageData = await this.captureImageFromCamera();
            const analysisResult = await this.analyzeImageWithAI(imageData);
            
            this.displayAnalysisResults(analysisResult);
            this.announceRating(analysisResult.rating);
            this.showSuccessAnimation();
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.showErrorNotification(`Analysis failed: ${error.message}`);
        } finally {
            this.updateButtonState(captureButton, 'ready', 'Capture & Analyze');
            this.hideLoadingState(loadingElement);
        }
    }

    /**
     * Capture image from the camera stream
     * @returns {Promise<string>} Base64 encoded image data
     */
    async captureImageFromCamera() {
        if (!this.camera) {
            throw new Error('Camera not initialized');
        }
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = this.camera.videoWidth;
        canvas.height = this.camera.videoHeight;
        
        context.drawImage(this.camera, 0, 0);
        
        console.log('Image captured, dimensions:', canvas.width, 'x', canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Image converted to base64, length:', imageData.length);
        
        return imageData;
    }

    /**
     * Analyze image using AI API (Gemini or Perplexity)
     * @param {string} imageData - Base64 encoded image
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeImageWithAI(imageData) {
        const config = await this.getAPIConfigFromServer();
        
        if (!config) {
            console.log('Using mock data - API config not available');
            
            // Show notification that we're using demo data
            this.showNotification(
                'Demo Mode', 
                'API configuration not available. Using demo data.',
                'Check server logs for more information.',
                'warning'
            );
            
            return this.getMockAnalysisResult();
        }
        
        // Determine which API to use
        const provider = config.defaultProvider || 'gemini';
        const apiKey = provider === 'gemini' ? config.geminiApiKey : config.perplexityApiKey;
        
        if (!this.isValidAPIKey(apiKey, provider)) {
            console.log(`Using mock data - ${provider} API key not configured`);
            
            // Show notification that we're using demo data
            this.showNotification(
                'Demo Mode', 
                'Using demo data. Add a real API key to .env file for actual AI analysis.',
                'Get your free API key at: https://aistudio.google.com/app/apikey',
                'warning'
            );
            
            return this.getMockAnalysisResult();
        }
        
        console.log(`Sending request to ${provider} API...`);
        
        try {
            // Use server-side analysis endpoint
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageData: imageData,
                    provider: provider
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
            }
            
            const analysisData = await response.json();
            return analysisData;
        } catch (error) {
            console.error(`${provider} API failed:`, error.message);
            
            // Show notification about the error
            this.showNotification(
                'API Error', 
                `${provider} API is currently unavailable. Using demo data.`,
                error.message,
                'warning'
            );
            
            return this.getMockAnalysisResult();
        }
    }

    /**
     * Get API configuration from server
     * @returns {Promise<Object>} API configuration
     */
    async getAPIConfigFromServer() {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            return config;
        } catch (error) {
            console.error('Failed to load API config:', error);
            return null;
        }
    }

    /**
     * Validate API key format for different providers
     * @param {string} apiKey - API key to validate
     * @param {string} provider - API provider ('gemini' or 'perplexity')
     * @returns {boolean}
     */
    isValidAPIKey(apiKey, provider = 'gemini') {
        if (!apiKey) {return false;}
        
        if (provider === 'gemini') {
            // Just check format, not specific values since user's key might match examples
            return apiKey.startsWith('AIza') && apiKey.length > 20;
        } else {
            // Check if it's not the obvious placeholder
            return apiKey !== 'pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' && 
                   apiKey.startsWith('pplx-') &&
                   apiKey.length > 20;
        }
    }

    /**
     * Make API request to Perplexity
     * @param {string} imageData - Base64 image data
     * @param {string} apiKey - API key
     * @returns {Promise<Response>} API response
     */
    async makeAPIRequest(imageData, apiKey) {
        const requestBody = this.buildAPIRequestBody(imageData);
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Perplexity API response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perplexity API error response:', errorText);
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }
        
        return response;
    }

    /**
     * Build request body for Perplexity API
     * @param {string} imageData - Base64 image data
     * @returns {Object} Request body
     */
    buildAPIRequestBody(imageData) {
        return {
            model: 'llama-3.1-sonar-small-128k',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: this.getAnalysisPrompt()
                        },
                        {
                            type: 'image_url',
                            image_url: imageData
                        }
                    ]
                }
            ],
            max_tokens: 500
        };
    }

    /**
     * Get the analysis prompt for the AI
     * @returns {string} Analysis prompt
     */
    getAnalysisPrompt() {
        return `Analyze this food image and provide a rating using Singapore's 5-tier system:
        1. Premium (Green) - Exceptional quality, presentation, and taste
        2. High Standard (Blue) - Very good quality with minor improvements possible
        3. Standard (Yellow) - Acceptable quality with room for improvement
        4. Improvement Needed (Orange) - Below average with significant issues
        5. Poor (Red) - Unacceptable quality with major problems
        
        Provide your response in this exact JSON format:
        {
            "rating": 1-5,
            "pros": ["pro1", "pro2", "pro3"],
            "cons": ["con1", "con2", "con3"]
        }`;
    }

    /**
     * Parse API response and extract analysis data
     * @param {Response} response - API response
     * @returns {Promise<Object>} Parsed analysis data
     */
    async parseAPIResponse(response) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (error) {
            throw new Error('Invalid response format from Perplexity');
        }
    }

    /**
     * Get mock analysis result for testing
     * @returns {Object} Mock analysis data
     */
    getMockAnalysisResult() {
        // Simulate the same check as the AI - return no food detected for demo
        const shouldDetectFood = Math.random() > 0.7; // 30% chance of detecting food for demo
        
        if (!shouldDetectFood) {
            return {
                foodDetected: false,
                message: "No food detected in this image. Please take a photo showing actual food items like prepared dishes, meals, or food ready to eat."
            };
        }
        
        const mockData = [
            {
                foodDetected: true,
                rating: 1,
                ratingName: 'Premium',
                foodName: 'Grilled Salmon with Quinoa',
                productDetails: {
                    category: 'Healthy Seafood',
                    estimatedCalories: '420 kcal',
                    protein: '28g',
                    carbs: '35g',
                    fat: '18g',
                    fiber: '8g',
                    sodium: '580mg'
                },
                healthScore: 92,
                pros: ['Perfectly grilled salmon', 'Nutrient-rich quinoa', 'Beautiful presentation', 'Balanced macronutrients', 'Fresh vegetables'],
                cons: ['Could use more seasoning', 'Portion slightly small'],
                recommendations: ['Add lemon for extra flavor', 'Consider larger portion for active individuals']
            },
            {
                foodDetected: true,
                rating: 2,
                ratingName: 'High Standard',
                foodName: 'Mediterranean Chicken Bowl',
                productDetails: {
                    category: 'Mediterranean',
                    estimatedCalories: '380 kcal',
                    protein: '32g',
                    carbs: '28g',
                    fat: '14g',
                    fiber: '12g',
                    sodium: '620mg'
                },
                healthScore: 88,
                pros: ['Fresh ingredients', 'Good protein content', 'Healthy vegetables', 'Nice seasoning', 'Balanced nutrition'],
                cons: ['Could use more sauce', 'Portion slightly small'],
                recommendations: ['Add tahini sauce', 'Include more vegetables for fiber']
            },
            {
                foodDetected: true,
                rating: 3,
                ratingName: 'Standard',
                foodName: 'Homemade Pasta with Vegetables',
                productDetails: {
                    category: 'Italian Home Cooking',
                    estimatedCalories: '450 kcal',
                    protein: '18g',
                    carbs: '65g',
                    fat: '12g',
                    fiber: '8g',
                    sodium: '580mg'
                },
                healthScore: 75,
                pros: ['Fresh pasta', 'Good portion size', 'Contains vegetables', 'Homemade taste'],
                cons: ['Could use more protein', 'Sauce needs improvement', 'Slightly overcooked'],
                recommendations: ['Add lean meat or cheese', 'Improve sauce consistency', 'Cook pasta al dente']
            }
        ];
        
        return mockData[Math.floor(Math.random() * mockData.length)];
    }

    /**
     * Display analysis results in the UI
     * @param {Object} analysisResult - Analysis data to display
     */
    displayAnalysisResults(analysisResult) {
        // Check if food was detected
        if (analysisResult.foodDetected === false) {
            this.displayNoFoodMessage(analysisResult.message);
            return;
        }
        
        this.hideInitialState();
        this.showResultsSections();
        this.updateRatingBadge(analysisResult.rating, analysisResult.ratingName);
        this.updateProductDetails(analysisResult);
        this.updateProsAndConsLists(analysisResult.pros, analysisResult.cons);
        this.updateRecommendations(analysisResult.recommendations);
    }

    /**
     * Display message when no food is detected
     * @param {string} message - Message to display
     */
    displayNoFoodMessage(message) {
        const resultsSection = document.getElementById('results-section');
        const initialState = document.getElementById('initial-state');
        
        if (!resultsSection || !initialState) {
            console.error('Required UI elements not found');
            return;
        }
        
        // Hide initial state and show results
        initialState.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        // Clear previous results and show no food message
        this.hideAllResultSections();
        
        // Create and display no food message
        const noFoodHTML = `
            <div class="text-center py-16">
                <div class="w-24 h-24 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                </div>
                <h4 class="text-xl font-semibold text-gray-700 mb-2">No Food Detected</h4>
                <p class="text-gray-500 mb-4">${message}</p>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-lightbulb mr-2"></i>
                        <strong>Tip:</strong> Make sure to capture actual food items like dishes, meals, or ingredients for analysis.
                    </p>
                </div>
            </div>
        `;
        
        resultsSection.innerHTML = noFoodHTML;
        this.addAnimationToElement(resultsSection, 'fadeInUp');
    }

    /**
     * Hide all result sections
     */
    hideAllResultSections() {
        const sections = [
            'product-name-section', 
            'health-score-section',
            'rating-section', 
            'nutrition-details-section',
            'stats-section', 
            'pros-section', 
            'cons-section',
            'recommendations-section'
        ];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('hidden');
            }
        });
    }

    /**
     * Hide the initial state and show results sections
     */
    hideInitialState() {
        const initialState = document.getElementById('initial-state');
        if (initialState) {
            initialState.classList.add('hidden');
        }
    }

    /**
     * Show all results sections
     */
    showResultsSections() {
        const sections = [
            'product-name-section', 
            'health-score-section',
            'rating-section', 
            'nutrition-details-section',
            'stats-section', 
            'pros-section', 
            'cons-section',
            'recommendations-section'
        ];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');
            }
        });
    }

    /**
     * Update the rating badge with new data
     * @param {number} rating - Rating value (1-5)
     * @param {string} ratingName - Rating name
     */
    updateRatingBadge(rating, ratingName) {
        const badge = document.getElementById('rating-badge');
        if (!badge) {return;}
        
        const ratingConfig = this.ratingSystemConfig[rating];
        if (!ratingConfig) {return;}
        
        badge.className = `rating-badge inline-flex items-center px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg ${ratingConfig.color}`;
        badge.innerHTML = `
            <i class="${ratingConfig.icon} mr-3 text-2xl"></i>
            ${ratingName || ratingConfig.name}
        `;
        
        this.addAnimationToElement(badge, 'fadeInUp');
    }

    /**
     * Update product details section
     * @param {Object} analysisResult - Analysis data
     */
    updateProductDetails(analysisResult) {
        const productName = analysisResult.foodName || analysisResult.productName || 'Unknown Food';
        const productDetails = analysisResult.productDetails || {};
        const healthScore = analysisResult.score || analysisResult.healthScore || 0;
        
        // Update product name
        const nameElement = document.getElementById('product-name');
        if (nameElement) {
            nameElement.textContent = productName;
            nameElement.classList.remove('hidden');
        }
        
        // Update health score
        const healthScoreElement = document.getElementById('health-score');
        if (healthScoreElement) {
            healthScoreElement.textContent = `${healthScore}%`;
            healthScoreElement.classList.remove('hidden');
        }
        
        // Update nutrition details
        this.updateNutritionDetails(productDetails);
    }

    /**
     * Update nutrition details
     * @param {Object} details - Product details
     */
    updateNutritionDetails(details) {
        const nutritionSection = document.getElementById('nutrition-details');
        if (!nutritionSection) {return;}
        
        const nutritionHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="font-semibold text-gray-800">${details.estimatedCalories || 'N/A'}</div>
                    <div class="text-xs text-gray-600">Calories</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="font-semibold text-blue-600">${details.protein || 'N/A'}</div>
                    <div class="text-xs text-gray-600">Protein</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="font-semibold text-orange-600">${details.carbs || 'N/A'}</div>
                    <div class="text-xs text-gray-600">Carbs</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="font-semibold text-red-600">${details.fat || 'N/A'}</div>
                    <div class="text-xs text-gray-600">Fat</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="font-semibold text-green-600">${details.fiber || 'N/A'}</div>
                    <div class="text-xs text-gray-600">Fiber</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="font-semibold text-purple-600">${details.sodium || 'N/A'}</div>
                    <div class="text-xs text-gray-600">Sodium</div>
                </div>
            </div>
        `;
        
        nutritionSection.innerHTML = nutritionHTML;
        nutritionSection.classList.remove('hidden');
    }

    /**
     * Update recommendations section
     * @param {Array} recommendations - List of recommendations
     */
    updateRecommendations(recommendations) {
        const recommendationsSection = document.getElementById('recommendations-section');
        if (!recommendationsSection || !recommendations || recommendations.length === 0) {return;}
        
        const recommendationsHTML = `
            <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <i class="fas fa-lightbulb text-yellow-600 mr-2 text-xl"></i>
                Recommendations
            </h4>
            <ul class="space-y-3">
                ${recommendations.map((rec, index) => `
                    <li class="pros-cons-item flex items-start space-x-3" style="animation-delay: ${index * 0.1}s">
                        <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i class="fas fa-lightbulb text-yellow-600 text-sm"></i>
                        </div>
                        <span class="text-gray-700 text-sm">${this.sanitizeText(rec)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        
        recommendationsSection.innerHTML = recommendationsHTML;
        recommendationsSection.classList.remove('hidden');
    }

    /**
     * Update pros and cons lists with new data
     * @param {Array} pros - List of positive points
     * @param {Array} cons - List of negative points
     */
    updateProsAndConsLists(pros, cons) {
        this.updateList('pros-list', pros, 'check-circle', 'text-green-600');
        this.updateList('cons-list', cons, 'times-circle', 'text-red-600');
        this.updateStatsCounts(pros.length, cons.length);
    }

    /**
     * Update a specific list with new items
     * @param {string} listId - ID of the list element
     * @param {Array} items - Items to display
     * @param {string} iconClass - FontAwesome icon class
     * @param {string} iconColor - Icon color class
     */
    updateList(listId, items, iconClass, iconColor) {
        const list = document.getElementById(listId);
        if (!list) {return;}
        
        list.innerHTML = '';
        
        items.forEach((item, index) => {
            const listItem = this.createListItem(item, iconClass, iconColor, index);
            list.appendChild(listItem);
        });
    }

    /**
     * Create a list item element
     * @param {string} text - Item text
     * @param {string} iconClass - Icon class
     * @param {string} iconColor - Icon color
     * @param {number} index - Item index for animation delay
     * @returns {HTMLElement} List item element
     */
    createListItem(text, iconClass, iconColor, index) {
        const li = document.createElement('li');
        li.className = 'pros-cons-item flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200';
        li.style.animationDelay = `${index * 0.1}s`;
        
        const iconBackground = iconColor === 'text-green-600' ? 'bg-green-100' : 'bg-red-100';
        
        li.innerHTML = `
            <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4 ${iconBackground}">
                <i class="fas ${iconClass} ${iconColor} text-lg"></i>
            </div>
            <span class="text-gray-700 font-medium">${this.sanitizeText(text)}</span>
        `;
        
        return li;
    }

    /**
     * Update statistics counts
     * @param {number} prosCount - Number of pros
     * @param {number} consCount - Number of cons
     */
    updateStatsCounts(prosCount, consCount) {
        const prosCountElement = document.getElementById('pros-count');
        const consCountElement = document.getElementById('cons-count');
        
        if (prosCountElement) {prosCountElement.textContent = prosCount;}
        if (consCountElement) {consCountElement.textContent = consCount;}
    }

    /**
     * Announce the rating using speech synthesis
     * @param {number} rating - Rating value
     */
    announceRating(rating) {
        if (!this.speechSynthesis) {return;}
        
        const ratingConfig = this.ratingSystemConfig[rating];
        if (!ratingConfig) {return;}
        
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(`Rating: ${ratingConfig.name}`);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        this.speechSynthesis.speak(utterance);
    }

    /**
     * Show success animation with confetti effect
     */
    showSuccessAnimation() {
        const confetti = document.createElement('div');
        confetti.className = 'fixed inset-0 pointer-events-none z-40';
        confetti.innerHTML = this.generateConfettiHTML();
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }

    /**
     * Generate confetti HTML elements
     * @returns {string} Confetti HTML
     */
    generateConfettiHTML() {
        const colors = ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'];
        const positions = ['top-1/4 left-1/4', 'top-1/3 left-1/2', 'top-1/2 left-1/3', 'top-2/3 left-2/3', 'top-3/4 left-1/4'];
        
        return positions.map((position, index) => 
            `<div class="absolute ${position} w-2 h-2 ${colors[index]} rounded-full animate-bounce" style="animation-delay: ${index * 0.2}s;"></div>`
        ).join('');
    }

    /**
     * Show camera error notification with specific guidance
     * @param {Error} error - Camera error
     */
    showCameraErrorNotification(error) {
        const { message, instructions } = this.getCameraErrorMessage(error);
        this.showNotification('Camera Error', message, instructions, 'error');
    }

    /**
     * Get camera error message and instructions
     * @param {Error} error - Camera error
     * @returns {Object} Error message and instructions
     */
    getCameraErrorMessage(error) {
        const errorMessages = {
            'NotAllowedError': {
                message: 'Camera permission denied.',
                instructions: window.location.protocol === 'https:' 
                    ? 'Tap the camera icon in your browser\'s address bar, or go to Settings > Safari > Camera and allow access.'
                    : 'HTTPS is required for camera access. Please use the HTTPS version of this site.'
            },
            'NotFoundError': {
                message: 'No camera found.',
                instructions: 'Please check your device has a camera and it\'s not being used by another app.'
            },
            'NotReadableError': {
                message: 'Camera is in use by another application.',
                instructions: 'Please close other apps using the camera (like Camera app) and try again.'
            },
            'NotSupportedError': {
                message: 'Camera not supported on this device.',
                instructions: 'Please try using a different device or browser that supports camera access.'
            },
            'SecurityError': {
                message: 'Camera access blocked by security policy.',
                instructions: 'This site must be served over HTTPS to access the camera. Please use the secure version.'
            }
        };
        
        const defaultMessage = {
            message: 'Camera access failed.',
            instructions: window.location.protocol === 'https:' 
                ? 'Check your browser settings and ensure camera permissions are enabled.'
                : 'HTTPS is required for camera access. Please use the secure version of this site.'
        };
        
        return errorMessages[error.name] || defaultMessage;
    }

    /**
     * Show success notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    showSuccessNotification(title, message) {
        this.showNotification(title, message, '', 'success');
    }

    /**
     * Show error notification
     * @param {string} message - Error message
     */
    showErrorNotification(message) {
        this.showNotification('Error', message, '', 'error');
    }

    /**
     * Show notification with specified type
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} instructions - Additional instructions
     * @param {string} type - Notification type ('success', 'error', or 'warning')
     */
    showNotification(title, message, instructions, type) {
        const notification = document.createElement('div');
        let bgClass, iconClass;
        
        switch (type) {
            case 'error':
                bgClass = 'from-red-500 to-red-600';
                iconClass = 'fa-exclamation-triangle';
                break;
            case 'warning':
                bgClass = 'from-yellow-500 to-yellow-600';
                iconClass = 'fa-exclamation-circle';
                break;
            case 'success':
            default:
                bgClass = 'from-green-500 to-green-600';
                iconClass = 'fa-check-circle';
                break;
        }
        
        notification.className = `fixed top-4 left-4 right-4 bg-gradient-to-r ${bgClass} text-white px-4 py-4 rounded-xl shadow-2xl z-50 transform translate-y-full transition-transform duration-300`;
        
        notification.innerHTML = `
            <div class="flex items-start">
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <i class="fas ${iconClass} text-lg"></i>
                </div>
                <div class="flex-1">
                    <div class="font-semibold mb-1">${this.sanitizeText(title)}</div>
                    <div class="text-sm opacity-90 mb-2">${this.sanitizeText(message)}</div>
                    ${instructions ? `<div class="text-xs opacity-75">${this.sanitizeText(instructions)}</div>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-y-full');
        }, 100);
        
        // Auto-remove after delay
        const delay = type === 'error' ? 10000 : type === 'warning' ? 8000 : 3000;
        setTimeout(() => {
            notification.classList.add('translate-y-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, delay);
    }

    /**
     * Update button state
     * @param {HTMLElement} button - Button element
     * @param {string} state - Button state ('loading', 'error', 'ready')
     * @param {string} text - Button text
     */
    updateButtonState(button, state, text) {
        if (!button) {return;}
        
        const iconMap = {
            loading: 'fa-spinner fa-spin',
            error: 'fa-camera',
            ready: 'fa-camera-retro'
        };
        
        const icon = iconMap[state] || 'fa-camera';
        button.disabled = state === 'loading';
        button.innerHTML = `<i class="fas ${icon} mr-2"></i>${text}`;
    }

    /**
     * Show loading state
     * @param {HTMLElement} loadingElement - Loading element
     */
    showLoadingState(loadingElement) {
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }
    }

    /**
     * Hide loading state
     * @param {HTMLElement} loadingElement - Loading element
     */
    hideLoadingState(loadingElement) {
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    }

    /**
     * Hide camera overlay
     * @param {HTMLElement} overlay - Camera overlay element
     */
    hideCameraOverlay(overlay) {
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    /**
     * Add animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - Animation class name
     */
    addAnimationToElement(element, animationClass) {
        if (!element) {return;}
        
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `${animationClass} 0.5s ease-out`;
    }

    /**
     * Sanitize text to prevent XSS
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeText(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            new FoodVisionApp();
        } catch (error) {
            console.error('Failed to initialize FoodVision AI:', error);
            // Show user-friendly error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed inset-0 bg-red-500 text-white flex items-center justify-center z-50';
            errorDiv.innerHTML = `
                <div class="text-center p-8">
                    <h1 class="text-2xl font-bold mb-4">Application Error</h1>
                    <p class="mb-4">Failed to initialize FoodVision AI application.</p>
                    <button onclick="location.reload()" class="bg-white text-red-500 px-4 py-2 rounded-lg">
                        Reload Page
                    </button>
                </div>
            `;
            document.body.appendChild(errorDiv);
        }
    });
}

// Export for testing in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FoodVisionApp };
}
