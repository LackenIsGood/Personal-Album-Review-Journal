# 🔧 Troubleshooting Guide

Quick solutions to common issues.

---

## 🚨 Deployment Issues

### ❌ Site Shows "404 - File not found"

**Causes:**
1. Wrong `base` path in `vite.config.ts`
2. GitHub Pages not enabled
3. Wrong branch selected

**Solutions:**
```bash
# 1. Check vite.config.ts
# Make sure base matches your repo name exactly
# Example: base: '/music-journal/'

# 2. Rebuild
npm run build

# 3. Redeploy
git add .
git commit -m "Fix base path"
git push origin main
git subtree push --prefix dist origin gh-pages

# 4. Check GitHub Settings
# Go to Settings → Pages
# Source: gh-pages branch, / (root)
```

### ❌ Blank White Page

**Cause:** JavaScript errors or wrong paths

**Solutions:**
1. Open browser console (F12)
2. Look for red error messages
3. Usually a `base` path issue
4. Rebuild and redeploy (see above)

### ❌ Styles Look Broken / No CSS

**Cause:** Asset paths are wrong

**Solution:**
```bash
# Fix base path in vite.config.ts
# Then:
npm run build
git subtree push --prefix dist origin gh-pages --force
```

---

## 💾 Data Issues

### ❌ Lost All My Albums

**Causes:**
- Cleared browser data
- Different browser/device
- Incognito mode

**Solutions:**
- Data is in localStorage - browser specific
- No automatic backup
- Manual backup: DevTools → Application → Local Storage → Copy data
- Prevention: Export data regularly

### ❌ Can't See Sample Data

**Solution:**
```javascript
// In browser console:
localStorage.removeItem('music_journal_welcome_seen');
location.reload();
// Click "Start with Sample Data"
```

### ❌ Want to Clear Everything and Start Fresh

**Solution:**
```javascript
// In browser console (F12):
localStorage.clear();
location.reload();
```

---

## 🖼️ Image Issues

### ❌ Album Cover Not Showing

**Checklist:**
- [ ] Is it a valid URL?
- [ ] Does it work when pasted in browser?
- [ ] Is it a direct image link? (ends in .jpg, .png, etc.)
- [ ] Is it publicly accessible?
- [ ] Check browser console for CORS errors

**Solutions:**
```
✅ Good URLs:
https://i.imgur.com/abc123.jpg
https://raw.githubusercontent.com/user/repo/main/image.png

❌ Bad URLs:
imgur.com/abc123 (not direct link)
C:\Users\...\image.jpg (local file path)
```

### ❌ Images Load Slowly

**Solutions:**
- Use compressed images
- Recommended size: 400x400px to 800x800px
- Use image hosting services (Imgur, ImgBB)
- Optimize before uploading

---

## 🎵 Song Link Issues

### ❌ Song Won't Play

**Cause:** Link might not be direct/embeddable

**Best Practices:**
- ✅ YouTube: Use share link
- ✅ Spotify: Use track link  
- ✅ SoundCloud: Use track link
- ❌ Local files: Won't work unless hosted

---

## 🐛 Git Issues

### ❌ Can't Push to GitHub

**Check:**
```bash
# Are you logged in?
git config user.name
git config user.email

# Is remote correct?
git remote -v

# If wrong, fix it:
git remote set-url origin https://github.com/USERNAME/REPO.git
```

### ❌ "git subtree" Command Fails

**Solution 1:**
```bash
# Force push
git push origin `git subtree split --prefix dist main`:gh-pages --force
```

**Solution 2:**
```bash
# Delete and recreate gh-pages
git push origin --delete gh-pages
git subtree push --prefix dist origin gh-pages
```

### ❌ "fatal: 'origin' does not appear to be a git repository"

**Solution:**
```bash
# Add remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

---

## 🎨 Visual Issues

### ❌ Dark Mode Not Working

**Solutions:**
1. Click sun/moon button (top right)
2. Clear browser cache
3. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

### ❌ Buttons/Colors Look Wrong

**Likely Cause:** Browser cache

**Solution:**
```bash
# Rebuild
npm run build

# Redeploy
git subtree push --prefix dist origin gh-pages

# Then hard refresh browser
# Ctrl + Shift + R (or Cmd + Shift + R)
```

---

## 💻 Development Issues

### ❌ `npm install` Fails

**Solutions:**
```bash
# Try cleaning cache
npm cache clean --force
npm install

# Or delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ❌ `npm run build` Fails

**Check:**
1. Node version (need v16+)
2. Error message in console
3. Fix TypeScript errors first

**Common Fix:**
```bash
# Clear and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### ❌ Local Dev Server Won't Start

**Solutions:**
```bash
# Try different port
npm run dev -- --port 3000

# Or kill existing process
# Windows: taskkill /F /IM node.exe
# Mac/Linux: killall node
```

---

## 📱 Browser Issues

### ❌ Works on Desktop, Broken on Mobile

**Likely Issues:**
- Image URLs too large
- LocalStorage full
- Responsive design issue

**Solutions:**
- Test in mobile browser DevTools
- Check image sizes
- Clear mobile browser cache

### ❌ Different Data in Different Browsers

**This is Normal!**
- localStorage is browser-specific
- Each browser has separate data
- Same for Incognito mode
- Export/import data if needed

---

## 🔍 Finding Errors

### How to Check Console

**Chrome/Edge:**
1. Press F12
2. Click "Console" tab
3. Look for red errors

**Firefox:**
1. Press F12
2. Click "Console" tab
3. Look for red errors

**Safari:**
1. Enable Developer menu: Safari → Preferences → Advanced
2. Develop → Show JavaScript Console
3. Look for errors

---

## 🆘 Still Stuck?

### Debugging Checklist

- [ ] Checked browser console for errors?
- [ ] Tried hard refresh (Ctrl+Shift+R)?
- [ ] Verified `base` in vite.config.ts?
- [ ] Rebuilt with `npm run build`?
- [ ] Redeployed to gh-pages?
- [ ] Waited 2-3 minutes for GitHub?
- [ ] Tested in different browser?
- [ ] Cleared browser cache?

### Start Fresh

If all else fails:
```bash
# 1. Save your important data (if any)
# Export from DevTools → Local Storage

# 2. Delete and reclone repo
cd ..
rm -rf my-music-journal
git clone <your-repo-url>
cd my-music-journal

# 3. Reinstall and rebuild
npm install
npm run build

# 4. Redeploy
git subtree push --prefix dist origin gh-pages
```

---

## 📞 Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Docs](https://vitejs.dev/)
- [Git Docs](https://git-scm.com/doc)

---

**Most issues are solved by:**
1. Checking the `base` path in `vite.config.ts`
2. Rebuilding with `npm run build`
3. Redeploying with `git subtree push --prefix dist origin gh-pages`
4. Hard refreshing your browser

Good luck! 🎵
