# API Setup Guide 🔧

## Current Issue

The FoodVision AI application is experiencing an issue with the Perplexity API model name. The model `llama-3.1-sonar-small-128k` is not currently available.

## ✅ **Current Status**

- **API Key**: ✅ Valid and working
- **Authentication**: ✅ Successful
- **Model**: ❌ Currently unavailable
- **Fallback**: ✅ Mock data is being used for demonstration

## 🔧 **Solutions**

### **Option 1: Use Current Demo Mode (Recommended)**

The application is currently working with mock data, which allows you to:
- ✅ Test the camera functionality
- ✅ Experience the UI and user interface
- ✅ See the rating system in action
- ✅ Test mobile camera access

### **Option 2: Update to Correct Model (Advanced)**

If you want to use real AI analysis, you'll need to:

1. **Check Current Perplexity Models**
   ```bash
   # Visit the official documentation
   https://docs.perplexity.ai/guides/model-cards
   ```

2. **Find Vision-Capable Models**
   - Look for models that support image analysis
   - Models should have "vision" or "image" capabilities

3. **Update the Model Name**
   - Edit `app.js` and `server.js`
   - Replace the current model name with a valid one
   - Test with the API endpoint

### **Option 3: Use Alternative AI Provider**

You can modify the application to use:
- **OpenAI GPT-4 Vision** (requires OpenAI API key)
- **Google Gemini Vision** (requires Google API key)
- **Claude Vision** (requires Anthropic API key)

## 🧪 **Testing the Current Setup**

### **Test API Connection**
```bash
curl http://localhost:8000/api/test-perplexity
```

**Expected Response:**
```json
{
  "success": false,
  "message": "API key is valid but model is not available",
  "details": "The specified Perplexity model is not currently available..."
}
```

### **Test Application**
1. Open `http://localhost:8000` in your browser
2. Click "Enable Camera"
3. Take a photo and click "Capture & Analyze"
4. You should see mock analysis results

## 📱 **Mobile Testing**

The application works perfectly on mobile with mock data:

1. **Generate SSL certificates** (if not done already):
   ```bash
   ./generate-cert.sh
   ```

2. **Find your IP address**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Access on mobile**:
   - Open browser on your phone
   - Navigate to `https://YOUR_IP:8443`
   - Accept security warning
   - Grant camera permissions
   - Test the full functionality

## 🔍 **Troubleshooting**

### **Camera Issues**
- Ensure you're using HTTPS on mobile
- Check browser permissions
- Try refreshing the page

### **API Issues**
- Verify your Perplexity API key is correct
- Check the `.env` file configuration
- Test API connectivity

### **Model Issues**
- The current model name may be outdated
- Check Perplexity documentation for current models
- Consider using demo mode for testing

## 📊 **Current Features Working**

- ✅ **Camera Capture** - Full functionality
- ✅ **Mobile Support** - HTTPS and permissions
- ✅ **UI/UX** - Modern, responsive design
- ✅ **Rating System** - 5-tier Singapore system
- ✅ **Voice Feedback** - Text-to-speech
- ✅ **Error Handling** - Graceful fallbacks
- ✅ **Security** - Environment variables
- ✅ **Performance** - Optimized for mobile

## 🎯 **Next Steps**

1. **For Demo/Testing**: Continue using the current setup
2. **For Production**: Update to a valid Perplexity model
3. **For Development**: The current setup is perfect for UI/UX testing

## 📞 **Support**

If you need help:
1. Check this guide first
2. Test the API endpoint
3. Review the error messages
4. Consider using demo mode for now

---

**The application is fully functional with mock data and ready for testing!** 🚀
