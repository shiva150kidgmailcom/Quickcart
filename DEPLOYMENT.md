# Deployment Guide for QuickCart

This guide will help you deploy:
- **Frontend** → Vercel
- **Backend** → Railway

---

## 🚀 Part 1: Backend Deployment on Railway

### Step 1: Prepare Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"**

### Step 2: Connect Your Repository
1. Select **"Deploy from GitHub repo"**
2. Choose your repository: `shiva150kidgmailcom/Quickcart`
3. Select the **Backend** folder as the root directory
4. Click **"Deploy Now"**

### Step 3: Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
MONGO_DBurl=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=4000
```

**Important:**
- Replace `your_mongodb_connection_string` with your MongoDB Atlas connection string
- Replace `your_jwt_secret_key` with a random secret string
- Replace `your_stripe_secret_key` with your Stripe secret key
- Replace `your-vercel-app.vercel.app` with your Vercel deployment URL (you'll get this after frontend deployment)

### Step 4: Configure Build Settings
1. In Railway, go to **Settings** → **Root Directory**
2. Set Root Directory to: `Backend`
3. Railway will auto-detect Node.js

### Step 5: Get Your Backend URL
1. After deployment, Railway will provide a URL like: `https://your-app.up.railway.app`
2. **Copy this URL** - you'll need it for frontend configuration
3. Note: Railway provides HTTPS by default

---

## 🌐 Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"Add New Project"**

### Step 2: Import Your Repository
1. Select your repository: `shiva150kidgmailcom/Quickcart`
2. Configure Project:
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

### Step 3: Configure Environment Variables
In Vercel dashboard, go to **Environment Variables** and add:

```
VITE_API_URL=https://your-railway-backend.up.railway.app
```

**Important:**
- Replace `your-railway-backend.up.railway.app` with your Railway backend URL from Step 5 above

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a URL like: `https://your-app.vercel.app`

### Step 5: Update Backend with Frontend URL
1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Railway will automatically redeploy

---

## ✅ Post-Deployment Checklist

### Backend (Railway)
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] Backend URL is accessible (test: `https://your-backend.up.railway.app/`)
- [ ] CORS is configured to allow frontend domain

### Frontend (Vercel)
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Frontend builds successfully
- [ ] Frontend URL is accessible
- [ ] API calls are working (check browser console)

### Testing
- [ ] Test user registration/login
- [ ] Test adding items to cart
- [ ] Test checkout process
- [ ] Test Stripe payment integration
- [ ] Test order tracking

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Backend not starting
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**Problem:** CORS errors
- Verify `FRONTEND_URL` in Railway matches your Vercel URL
- Check that CORS middleware is enabled in `server.js`

**Problem:** Images not loading
- Ensure `uploads` folder exists
- Check file upload permissions
- Verify image URLs are using Railway domain

### Frontend Issues

**Problem:** API calls failing
- Verify `VITE_API_URL` environment variable is set
- Check that backend URL is correct (include `https://`)
- Check browser console for CORS errors

**Problem:** Build fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Problem:** 404 errors on routes
- Verify `vercel.json` rewrite rules are correct
- Ensure React Router is configured properly

---

## 📝 Important Notes

1. **Environment Variables:**
   - Never commit `.env` files to Git
   - Always set environment variables in deployment platforms
   - Use different values for development and production

2. **MongoDB:**
   - Use MongoDB Atlas for cloud database
   - Whitelist Railway IP addresses (or use 0.0.0.0/0 for all)
   - Keep connection string secure

3. **Stripe:**
   - Use production Stripe keys in production
   - Update webhook URLs in Stripe dashboard
   - Test payment flow thoroughly

4. **File Uploads:**
   - Railway's file system is ephemeral
   - Consider using cloud storage (AWS S3, Cloudinary) for production
   - Current setup stores files locally (will reset on redeploy)

5. **Domain Configuration:**
   - Both platforms support custom domains
   - Update environment variables if using custom domains
   - Ensure SSL certificates are enabled

---

## 🔄 Updating Deployments

### To update Backend:
1. Push changes to GitHub
2. Railway will auto-deploy (if auto-deploy is enabled)
3. Or manually trigger deployment in Railway dashboard

### To update Frontend:
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Or manually trigger deployment in Vercel dashboard

---

## 📞 Support

If you encounter issues:
1. Check deployment logs in Railway/Vercel dashboards
2. Verify environment variables are correct
3. Test API endpoints directly using Postman/curl
4. Check browser console for frontend errors

---

**Good luck with your deployment! 🚀**

