# 🚀 Deployment Guide - FoodVision AI

This guide will help you deploy your FoodVision AI application to make it publicly accessible.

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account (you already have this!)
- Vercel account (free)
- AI API key (Gemini recommended - free tier available)

### Step 1: Get Your API Key
1. **Go to Google AI Studio**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Create API Key** and copy it

### Step 2: Deploy to Vercel
1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Import Project** → Select your `foodvision-ai` repository
4. **Configure Project**:
   - Framework Preset: `Other`
   - Build Command: `npm run vercel-build`
   - Output Directory: `.` (current directory)
   - Install Command: `npm install`

### Step 3: Add Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

```
DEFAULT_AI_PROVIDER = gemini
GEMINI_API_KEY = your_actual_api_key_here
NODE_ENV = production
```

### Step 4: Deploy!
- Click **Deploy**
- Wait for deployment to complete (1-2 minutes)
- Your app will be live at: `https://your-project-name.vercel.app`

## Alternative Deployment Options

### Railway
1. Go to https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

### Render
1. Go to https://render.com
2. Connect GitHub repository
3. Choose "Web Service"
4. Add environment variables
5. Deploy

## Environment Variables Required

For any deployment platform, you need these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DEFAULT_AI_PROVIDER` | `gemini` | AI provider to use |
| `GEMINI_API_KEY` | Your API key | Get from Google AI Studio |
| `NODE_ENV` | `production` | Environment mode |

## Post-Deployment

### Test Your Live App
1. **Visit your deployed URL**
2. **Allow camera permissions**
3. **Take a photo of food**
4. **Verify AI analysis works**

### Update Your GitHub README
Add your live demo link to the README:

```markdown
## 🌐 Live Demo
**Try it now**: https://your-app-name.vercel.app
```

## Troubleshooting

### Common Issues

**Deployment Fails**
- Check that all environment variables are set
- Verify your API key is valid
- Check build logs in deployment platform

**App Loads but AI Doesn't Work**
- Verify environment variables are set correctly
- Check that your API key has credits/quota
- Look at server logs for error messages

**Camera Doesn't Work**
- Ensure the site is served over HTTPS (Vercel does this automatically)
- Check browser permissions
- Try on different devices/browsers

## Security Notes

✅ **Your API key is secure** - it's stored as an environment variable, not in your code  
✅ **HTTPS enabled** - Required for camera access  
✅ **No sensitive data in repository** - .gitignore protects your keys  

## Need Help?

1. **Check deployment logs** in your platform dashboard
2. **Test locally first** with `npm start`
3. **Verify API key** with the test endpoints
4. **Create an issue** in your GitHub repository

---

🎉 **Congratulations!** Your FoodVision AI app is now live and accessible to anyone on the internet!
