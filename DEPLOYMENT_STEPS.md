# 🚀 QuickCart Deployment Guide

## Step-by-Step Instructions

---

## 📦 PART 1: Backend Deployment on Railway

### Step 1: Create Railway Account
1. Visit https://railway.app
2. Click **"Start a New Project"**
3. Sign in with **GitHub** (recommended)
4. Authorize Railway to access your GitHub account

### Step 2: Deploy Backend
1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select your repository: **Quickcart**
4. Railway will ask for configuration:
   - **Root Directory:** Set to `Backend`
   - Click **"Deploy"**

### Step 3: Set Environment Variables
1. In Railway project, click on your service
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add each:

```
MONGO_DBurl = mongodb+srv://username:password@cluster.mongodb.net/quickcart?retryWrites=true&w=majority
```
*(Replace with your actual MongoDB Atlas connection string)*

```
JWT_SECRET = your_random_secret_key_here_min_32_characters
```
*(Generate a random string, e.g., use: openssl rand -base64 32)*

```
STRIPE_SECRET_KEY = sk_live_xxxxxxxxxxxxx
```
*(Your Stripe secret key from Stripe dashboard)*

```
FRONTEND_URL = https://your-app.vercel.app
```
*(You'll update this after deploying frontend - use placeholder for now)*

```
PORT = 4000
```
*(Railway will set this automatically, but good to have)*

4. Click **"Add"** after each variable
5. Railway will automatically redeploy

### Step 4: Get Backend URL
1. After deployment completes, Railway provides a URL
2. Click on your service → **"Settings"** → **"Domains"**
3. Copy the **Railway-provided domain** (e.g., `quickcart-production.up.railway.app`)
4. **Save this URL** - you'll need it for frontend!

### Step 5: Test Backend
1. Open the Railway URL in browser: `https://your-backend.up.railway.app/`
2. You should see: **"API Working"**
3. If not, check **"Deployments"** tab for logs

---

## 🌐 PART 2: Frontend Deployment on Vercel

### Step 1: Create Vercel Account
1. Visit https://vercel.com
2. Click **"Sign Up"**
3. Sign in with **GitHub** (recommended)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Project
1. In Vercel dashboard, click **"Add New Project"**
2. Import your repository: **Quickcart**
3. Configure Project Settings:
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `Frontend` ⚠️ **IMPORTANT**
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

### Step 3: Set Environment Variables
1. Before deploying, scroll to **"Environment Variables"**
2. Click **"Add"** and enter:

```
VITE_API_URL = https://your-backend.up.railway.app
```
*(Use the Railway backend URL from Part 1, Step 4)*

3. Make sure it's added to **Production**, **Preview**, and **Development**
4. Click **"Add"**

### Step 4: Deploy
1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Vercel will show build logs in real-time
4. Once complete, you'll get a URL like: `https://quickcart.vercel.app`

### Step 5: Update Backend with Frontend URL
1. Go back to **Railway** dashboard
2. Update the `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL = https://your-app.vercel.app
   ```
3. Railway will auto-redeploy

---

## ✅ PART 3: Final Configuration

### Update Stripe Webhook (Important!)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Add endpoint: `https://your-backend.up.railway.app/api/order/webhook`
4. Select events: `checkout.session.completed`
5. Copy webhook signing secret

### Update MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Add Railway IP or use `0.0.0.0/0` (allows all IPs - less secure but easier)
4. Ensure your database user has proper permissions

### Test Your Deployment
1. **Frontend:** Visit your Vercel URL
2. **Test Features:**
   - ✅ User registration/login
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Checkout process
   - ✅ Stripe payment
   - ✅ Order tracking

---

## 🔧 Troubleshooting

### Backend Issues

**❌ Problem: Build fails**
- Check Railway logs: **Deployments** → Click deployment → **View Logs**
- Ensure `package.json` has `"start": "node server.js"` script
- Verify Node.js version (Railway auto-detects)

**❌ Problem: Database connection fails**
- Verify `MONGO_DBurl` is correct
- Check MongoDB Atlas network access allows Railway IPs
- Ensure connection string includes database name

**❌ Problem: CORS errors**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check backend logs for CORS errors
- Ensure URL includes `https://`

**❌ Problem: Images not loading**
- Railway file system is ephemeral (resets on redeploy)
- For production, consider cloud storage (AWS S3, Cloudinary)
- Current setup works but files reset on redeploy

### Frontend Issues

**❌ Problem: API calls fail**
- Check browser console (F12) for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure backend URL includes `https://` (not `http://`)
- Check CORS configuration in backend

**❌ Problem: 404 on page refresh**
- Verify `vercel.json` exists in Frontend folder
- Check that rewrite rules are correct
- Ensure React Router is configured

**❌ Problem: Build fails**
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Check for TypeScript/ESLint errors

---

## 📋 Quick Reference

### Backend URLs
- **Railway Dashboard:** https://railway.app
- **Your Backend:** `https://your-app.up.railway.app`
- **Health Check:** `https://your-app.up.railway.app/` (should return "API Working")

### Frontend URLs
- **Vercel Dashboard:** https://vercel.com
- **Your Frontend:** `https://your-app.vercel.app`
- **Build Logs:** Available in Vercel dashboard

### Environment Variables Checklist

**Railway (Backend):**
- [ ] `MONGO_DBurl`
- [ ] `JWT_SECRET`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `FRONTEND_URL`
- [ ] `PORT` (optional, auto-set)

**Vercel (Frontend):**
- [ ] `VITE_API_URL`

---

## 🎉 Success Indicators

### Backend is working if:
- ✅ Railway shows "Deployed" status
- ✅ Visiting backend URL shows "API Working"
- ✅ No errors in Railway logs
- ✅ Database connection successful (check logs)

### Frontend is working if:
- ✅ Vercel shows "Ready" status
- ✅ Frontend loads without errors
- ✅ Can see products/catalog
- ✅ API calls succeed (check browser console)

---

## 🔄 Updating Your App

### To update Backend:
1. Make changes locally
2. Commit and push to GitHub: `git push origin main`
3. Railway auto-deploys (if enabled)
4. Or manually trigger in Railway dashboard

### To update Frontend:
1. Make changes locally
2. Commit and push to GitHub: `git push origin main`
3. Vercel auto-deploys
4. Check deployment status in Vercel dashboard

---

## 💡 Pro Tips

1. **Always test locally first** before deploying
2. **Keep environment variables secure** - never commit them
3. **Monitor logs** regularly for errors
4. **Use custom domains** for production (both platforms support this)
5. **Set up monitoring** - Railway and Vercel provide basic monitoring
6. **Backup your database** regularly (MongoDB Atlas has automated backups)

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Check deployment logs** in respective dashboards
- **Test API endpoints** using Postman or curl

---

**Good luck! Your QuickCart app should now be live! 🎊**

