# Vercel Deployment Setup Guide

## ✅ Current Status

- ✅ MongoDB connection configured and tested
- ✅ All API routes loaded successfully  
- ✅ Backend code pushed to GitHub
- ✅ Vercel serverless structure ready

## 🚀 Step 1: Configure Vercel Environment Variables

### For Backend (data-hub-roan.vercel.app)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **data-hub-roan** project
3. Click **Settings** → **Environment Variables**
4. Add these variables:

```
MONGODB_URI=mongodb+srv://Raja99555:Raja77@cluster0.rhqky3o.mongodb.net/
JWT_SECRET=your-secret-key-min-32-characters
NODE_ENV=production
RAZORPAY_KEY_ID=(leave empty for now)
RAZORPAY_KEY_SECRET=(leave empty for now)
GOOGLE_SHEETS_API_KEY=(optional)
```

### For Frontend (data-hub-eklo.vercel.app)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **data-hub-eklo** project
3. Click **Settings** → **Environment Variables**
4. Add this variable:

```
REACT_APP_API_URL=https://data-hub-roan.vercel.app
```

## 🔄 Step 2: Trigger Redeployment

### Backend:
1. Go to data-hub-roan project
2. Click **Deployments**
3. Find latest deployment
4. Click **⋯** menu → **Redeploy**
5. Wait for deployment to complete (green checkmark)

### Frontend:
1. Go to data-hub-eklo project
2. Click **Deployments**
3. Find latest deployment
4. Click **⋯** menu → **Redeploy**
5. Wait for deployment to complete

## ✅ Step 3: Verify API is Working

Test these endpoints:

```bash
# Health check
curl https://data-hub-roan.vercel.app/api/health

# Test endpoint
curl https://data-hub-roan.vercel.app/api/test

# Both should return 200 OK with JSON response
```

## 📝 Expected Responses

### `/api/health` (200 OK)
```json
{
  "status": "ok",
  "message": "Backend API is running",
  "timestamp": "2026-01-23T19:44:33.680Z"
}
```

### `/api/test` (200 OK)
```json
{
  "ok": true,
  "message": "API test route",
  "timestamp": "2026-01-23T19:44:33.680Z",
  "environment": "production"
}
```

## 🔐 Security Notes

1. **NEVER commit .env file** - it's in .gitignore
2. **Rotate JWT_SECRET** - use a strong random string
3. **Use .env.example** - for team reference only
4. **Enable HTTPS** - Vercel provides automatic HTTPS

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| 503 Database Error | Verify MONGODB_URI in Vercel env vars |
| 404 Routes | Clear cache, redeploy again |
| Auth endpoints fail | Check MongoDB connection |
| Deployment stuck | Check Vercel build logs |

## 📊 MongoDB Status

✅ **Connected to**: `cluster0.rhqky3o.mongodb.net`  
✅ **Connection tested locally**: Success  
✅ **Database ready**: Yes  

## 🎯 Next Steps

1. ✅ Add MONGODB_URI to Vercel environment
2. ✅ Add JWT_SECRET to Vercel environment
3. ✅ Redeploy backend on Vercel
4. ✅ Test `/api/health` and `/api/test`
5. ✅ Test login endpoint: `POST /api/auth/login`
6. ✅ Connect frontend
7. ✅ Monitor in production

## 📞 API Endpoints Summary

All endpoints are now available at: `https://data-hub-roan.vercel.app/api/`

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/profile/me` - Get profile
- `PUT /api/profile/me` - Update profile
- `GET /api/data/categories` - Get categories
- `POST /api/purchase/request` - Create purchase request
- `GET /api/admin/users` - List users (admin only)

For full API reference, see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

## ✨ Summary

Your DataHub backend is now:
- ✅ Fully configured with MongoDB
- ✅ Ready for Vercel deployment
- ✅ All routes tested locally
- ✅ Waiting for Vercel environment variables

**Action Required**: Add the environment variables to Vercel and redeploy!
