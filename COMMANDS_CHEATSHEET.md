# 📝 Command Cheatsheet - VMP Villa Invoice Generator

Quick reference for common commands.

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

---

## 🚀 Git & Deployment Commands

### First Time Setup

```bash
# Initialize git
git init

# Check status
git status

# Add all files
git add .

# First commit
git commit -m "Initial commit: VMP Villa Invoice Generator"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/vmp-villa-invoice-generator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Regular Updates

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Your change description"

# Push to GitHub (triggers auto-deploy on Vercel)
git push
```

---

## 🌐 Vercel Commands (Optional - CLI)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## 🔍 Troubleshooting Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node/npm versions
node --version
npm --version

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📦 Package Management

```bash
# Add new dependency
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check outdated packages
npm outdated

# Remove unused dependencies
npm prune
```

---

## 🎨 Useful Aliases (Optional - Add to your terminal)

Add to `.bashrc` or `.zshrc`:

```bash
alias vmpdev="cd 'd:\VMP webSite' && npm run dev"
alias vmpbuild="cd 'd:\VMP webSite' && npm run build"
alias vmpdeploy="cd 'd:\VMP webSite' && git add . && git commit -m 'Update' && git push"
```

---

## 🔗 Important URLs

- **Local Dev**: http://localhost:3000
- **GitHub**: https://github.com/YOUR_USERNAME/vmp-villa-invoice-generator
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live App**: https://vmp-villa-invoice-generator.vercel.app (your actual URL)

---

## ⌨️ Keyboard Shortcuts (in VS Code)

- `Ctrl + ` ` - Open terminal
- `Ctrl + Shift + P` - Command palette
- `Ctrl + B` - Toggle sidebar
- `Ctrl + /` - Comment line
- `F5` - Start debugging
- `Ctrl + Shift + F` - Search in files

---

**Save this for quick reference!** 📌
