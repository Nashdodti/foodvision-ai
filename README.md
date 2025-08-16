# FoodVision AI 🍽️

> **Intelligent Food Analysis Application** - AI-powered food rating system with camera capture and voice feedback

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-ESLint%20%2B%20Prettier-orange.svg)](https://eslint.org/)

## 🌟 Features

- **📸 Live Camera Capture** - Real-time camera feed with mobile-optimized interface
- **🤖 AI-Powered Analysis** - Multiple AI providers: Gemini, Perplexity, and OpenAI for intelligent food assessment
- **🎯 Singapore 5-Tier Rating System** - Premium, High Standard, Standard, Improvement Needed, Poor
- **🔊 Voice Feedback** - Text-to-speech announcements of analysis results
- **📱 Mobile-First Design** - Responsive layout optimized for mobile devices
- **🔒 Secure API Handling** - Environment-based API key management
- **⚡ Real-time Results** - Instant rating badges with pros/cons analysis

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 8.0.0 or higher
- **Modern web browser** with camera support
- **AI API key** (Gemini, Perplexity, or OpenAI for analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/foodvision-ai.git
   cd foodvision-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your AI API key (see API Setup section)
   ```

4. **Generate SSL certificates** (for mobile camera access)
   ```bash
   chmod +x generate-cert.sh
   ./generate-cert.sh
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - **Desktop**: http://localhost:8000
   - **Mobile**: https://YOUR_IP:8443

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
HTTPS_PORT=8443

# AI Provider (choose one: gemini, perplexity, or openai)
DEFAULT_AI_PROVIDER=gemini

# API Keys (add the one you want to use)
GEMINI_API_KEY=your_gemini_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here
OPENAI_API_KEY=your_openai_key_here
```

### AI API Setup

Choose one of the supported AI providers:

#### Option 1: Gemini (Recommended - Free tier available)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Add to `.env`: `GEMINI_API_KEY=your_key_here`
5. Set: `DEFAULT_AI_PROVIDER=gemini`

#### Option 2: Perplexity
1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up and obtain your API key
3. Add to `.env`: `PERPLEXITY_API_KEY=your_key_here`
4. Set: `DEFAULT_AI_PROVIDER=perplexity`

#### Option 3: OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Create an API key
3. Add to `.env`: `OPENAI_API_KEY=your_key_here`
4. Set: `DEFAULT_AI_PROVIDER=openai`

#### Test API Connection
```bash
# Test Gemini
curl http://localhost:8000/api/test-gemini

# Test Perplexity  
curl http://localhost:8000/api/test-perplexity
```

## 📱 Mobile Setup

For mobile camera access, HTTPS is required:

1. **Generate SSL certificates**
   ```bash
   ./generate-cert.sh
   ```

2. **Find your local IP address**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Access on mobile**
   - Open browser on your mobile device
   - Navigate to `https://YOUR_IP:8443`
   - Accept the security warning
   - Grant camera permissions when prompted

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm start           # Start production server

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint        # Check code with ESLint
npm run lint:fix    # Fix ESLint issues automatically
npm run format      # Format code with Prettier
npm run security-check # Check for security vulnerabilities
```

### Project Structure

```
foodvision-app/
├── 📁 src/                    # Source files
│   ├── 📄 app.js             # Main application logic
│   ├── 📄 index.html         # HTML template
│   └── 📄 server.js          # Express server
├── 📁 tests/                 # Test files
│   └── 📄 app.test.js        # Unit tests
├── 📁 docs/                  # Documentation
├── 📄 .env                   # Environment variables
├── 📄 .eslintrc.js          # ESLint configuration
├── 📄 .prettierrc           # Prettier configuration
├── 📄 package.json          # Dependencies and scripts
└── 📄 README.md             # This file
```

### Code Quality Standards

This project follows strict coding standards:

- **ESLint** for code linting and quality checks
- **Prettier** for consistent code formatting
- **Jest** for unit testing with high coverage
- **JSDoc** for comprehensive documentation
- **Security best practices** for API key handling

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/app.test.js
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 🔒 Security

### Best Practices Implemented

- ✅ **Environment Variables** - API keys stored securely
- ✅ **Input Sanitization** - XSS prevention
- ✅ **HTTPS Support** - Secure mobile camera access
- ✅ **Error Handling** - Graceful error management
- ✅ **Security Headers** - XSS, clickjacking protection

### Security Checklist

- [ ] API keys are never committed to version control
- [ ] All user inputs are sanitized
- [ ] HTTPS is used for mobile camera access
- [ ] Security headers are properly configured
- [ ] Dependencies are regularly updated

## 🐛 Troubleshooting

### Common Issues

**Camera Access Denied**
- Ensure you're using HTTPS on mobile
- Check browser camera permissions
- Try refreshing the page

**API Key Errors**
- Verify your AI API key is correct
- Check the `.env` file configuration  
- Test API connectivity with the appropriate test endpoint
- Ensure you have credits/quota available

**SSL Certificate Issues**
- Regenerate certificates: `./generate-cert.sh`
- Accept security warnings in browser
- Use the correct IP address

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

## 📊 Performance

### Optimization Features

- **Lazy Loading** - Components load on demand
- **Image Compression** - Optimized camera capture
- **Caching** - API responses cached when appropriate
- **Minimal Dependencies** - Lightweight package size

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB
- **API Response Time**: < 2s

## 🤝 Support

### Getting Help

- **Documentation**: Check this README first
- **Issues**: [GitHub Issues](https://github.com/foodvision-ai/foodvision-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/foodvision-ai/foodvision-app/discussions)

### Reporting Bugs

When reporting bugs, please include:

1. **Environment details** (OS, browser, Node.js version)
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Console errors** (if any)
5. **Screenshots** (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini**, **Perplexity AI**, and **OpenAI** for providing vision analysis APIs
- **TailwindCSS** for the beautiful UI framework
- **Font Awesome** for the icons
- **Express.js** for the server framework

---

**Made with ❤️ by the FoodVision AI Team**

*Empowering food quality assessment through AI technology*
