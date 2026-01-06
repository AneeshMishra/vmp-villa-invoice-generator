# 🚀 Quick Deploy to Vercel - 5 Minutes

## Step 1: Push to GitHub (2 minutes)

```bash
# In your project folder (d:\VMP webSite)

# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "VMP Villa Invoice Generator - Ready for deployment"

# Create a new repository on GitHub.com
# Then add it as remote (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/vmp-villa-invoice-generator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel (3 minutes)

### Visit: [vercel.com/new](https://vercel.com/new)

1. **Sign up/Login** with GitHub
2. **Import** your repository: `vmp-villa-invoice-generator`
3. Click **Deploy** (no configuration needed - everything is pre-configured!)
4. Wait 2-3 minutes ⏳
5. **Done!** Your app is live 🎉

---

## Your Live URL

You'll get: `https://vmp-villa-invoice-generator.vercel.app`

**That's it! Only 2 steps, 5 minutes total!** ✅

---

## Auto-Deploy Future Updates

Every time you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel automatically redeploys! No manual action needed. 🔄

---

## Need Help?

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
