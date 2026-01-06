# ✅ Pre-Deployment Checklist

Before deploying to Vercel, verify everything is working locally:

## 🔧 Local Testing

### 1. Install Dependencies
```bash
npm install
```
**Expected**: No errors, all packages installed ✅

### 2. Start Development Server
```bash
npm run dev
```
**Expected**: App runs at http://localhost:3000 ✅

### 3. Test Features Locally

- [ ] App loads without errors
- [ ] Invoice form displays correctly
- [ ] Can add invoice details (dates, customer info)
- [ ] Can add items to invoice
- [ ] Items appear in the invoice preview
- [ ] GST calculations work (CGST/SGST or IGST)
- [ ] Payment type selector works (Cash/Online)
- [ ] Amount in words displays correctly
- [ ] **PDF Export (High Quality)** button works
- [ ] **PDF Export (Fast)** button works
- [ ] **Print** button works
- [ ] Logo displays correctly (pink VMP Villa logo)
- [ ] Mobile responsive (test on phone or resize browser)

### 4. Build Test
```bash
npm run build
```
**Expected**: Build completes without errors ✅

### 5. Preview Production Build
```bash
npm run preview
```
**Expected**: App runs in production mode ✅

---

## 📁 Files Check

Verify these files exist:

- [ ] `package.json` - Has all dependencies
- [ ] `vite.config.ts` - Vite configuration
- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `tailwind.config.js` - Tailwind CSS config
- [ ] `vercel.json` - Vercel deployment config ⭐
- [ ] `.gitignore` - Git ignore rules
- [ ] `.env.example` - Environment variables template
- [ ] `README.md` - Project documentation
- [ ] `DEPLOYMENT_GUIDE.md` - Deployment instructions
- [ ] `QUICK_DEPLOY.md` - Quick deploy guide

---

## 🔍 Code Quality Check

### No TypeScript Errors
```bash
npx tsc --noEmit
```
**Expected**: No errors ✅

### Lint Check (Optional)
```bash
npm run lint
```
**Expected**: No critical errors ✅

---

## 🎯 Ready for Deployment?

If all checks pass:
✅ **Your app is ready for deployment!**

Proceed to [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for deployment steps.

---

## ⚠️ If You Find Issues

### Build Errors
- Check console for specific error messages
- Verify all imports are correct
- Ensure all dependencies are installed

### TypeScript Errors
- Run `npm run build` to see all errors
- Fix type issues in the code

### PDF Not Working
- Ensure `jspdf` and `html2canvas` are in `dependencies` section of `package.json`
- Check browser console for errors

### Styling Issues
- Verify Tailwind CSS is configured correctly
- Check `postcss.config.js` exists
- Ensure `index.css` imports Tailwind

---

## 📞 Need Help?

- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed troubleshooting
- Review Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check console errors in browser (F12)

---

**Once everything passes, you're ready to deploy!** 🚀
