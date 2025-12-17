# 🎵 My Music Journal

A comprehensive personal album review and listening journal built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Album Database**: Track albums with artist, title, release year, genre, and release type
- **Review System**: Rate albums (1-5 stars), add favorite tracks with timestamps, personal notes, and mood tags
- **Listening History**: Track how many times you've listened to each album
- **Discovery Sources**: Remember where you found each album
- **Year in Music**: View statistics and top albums by month/year
- **Smart Recommendations**: Get album suggestions based on your ratings and preferences
- **Dark/Light Mode**: Toggle between themes with a beautiful animated button
- **Filters**: Search and filter by genre, year, or artist
- **Album Covers & Songs**: Add album covers and song links (can be hosted on GitHub)

## 🚀 Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `my-music-journal`
3. Keep it public (required for GitHub Pages on free accounts)
4. Don't initialize with README, .gitignore, or license (we already have files)

### Step 2: Configure Vite for GitHub Pages

Before deploying, you need to update the Vite configuration to work with GitHub Pages.

**Edit `vite.config.ts` (create it if it doesn't exist):**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/my-music-journal/', // Replace 'my-music-journal' with YOUR repository name
});
```

**IMPORTANT**: Replace `my-music-journal` with your actual repository name!

### Step 3: Add Deploy Script to package.json

Add this to the `scripts` section in `package.json`:

```json
"scripts": {
  "build": "vite build",
  "deploy": "npm run build && echo 'Ready to deploy!'"
}
```

### Step 4: Build Your Project

Run the build command:

```bash
npm run build
```

This creates a `dist` folder with your built application.

### Step 5: Deploy to GitHub Pages

#### Option A: Using the GitHub Web Interface

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

2. Push the `dist` folder to a `gh-pages` branch:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

3. Go to your repository on GitHub
4. Click "Settings" → "Pages"
5. Under "Source", select branch: `gh-pages` and folder: `/ (root)`
6. Click "Save"
7. Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

#### Option B: Using GitHub Desktop

1. Open GitHub Desktop
2. Click "File" → "Add Local Repository"
3. Select your project folder
4. Click "Publish repository"
5. Follow Option A steps 2-7 above

### Step 6: Update Links After Every Change

Whenever you make changes:

```bash
npm run build
git add .
git commit -m "Update website"
git push origin main
git subtree push --prefix dist origin gh-pages
```

## 📁 Hosting Album Covers and Songs on GitHub

You can host your album covers and songs directly in your GitHub repository!

### Option 1: Create a Media Folder

1. Create a folder in your repository called `media` or `assets`
2. Inside, create subfolders: `covers` and `songs`
3. Upload your files there
4. Use the raw GitHub URL as your link:
   ```
   https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO-NAME/main/media/covers/album-cover.jpg
   https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO-NAME/main/media/songs/song.mp3
   ```

### Option 2: Use GitHub Releases

1. Go to your repo → "Releases" → "Create a new release"
2. Upload your files as release assets
3. Use the direct download link from the release

### File Size Limits

- GitHub has a 100MB file size limit per file
- For larger audio files, consider using:
  - YouTube links
  - SoundCloud links  
  - Spotify links
  - Or host on services like Dropbox, Google Drive (use direct download links)

## 💾 Data Storage

All your data is stored locally in your browser's localStorage. This means:

- ✅ Your data stays private on your device
- ✅ No server or database needed
- ⚠️ Data will be lost if you clear browser data
- ⚠️ Data is specific to each browser/device

To backup your data:
1. Open Browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy the values for `music_journal_albums`, `music_journal_reviews`, and `music_journal_history`
4. Save them in a text file

## 🎨 Customization

The app uses Tailwind CSS. You can customize colors and styles in:
- `/src/styles/theme.css` - Color tokens and theme variables
- Component files in `/src/app/pages/` - Individual page styles

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📱 Browser Support

Works best on modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## 🐛 Troubleshooting

**Issue**: Site shows 404 or broken styles after deploying
- **Fix**: Make sure the `base` in `vite.config.ts` matches your repo name exactly

**Issue**: Images not loading
- **Fix**: Use full GitHub raw URLs for images hosted on GitHub
- Make sure image URLs are publicly accessible

**Issue**: Lost all my data
- **Fix**: localStorage is browser-specific. Always keep backups of important data
- Consider exporting your data regularly

**Issue**: Dark mode not working
- **Fix**: Try clearing browser cache and refreshing the page

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and make it your own!

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
