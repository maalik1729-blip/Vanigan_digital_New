import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('.vercel/output/static');
const targets = [
  path.resolve('.output/public'),
  path.resolve('dist/client'),
  path.resolve('dist')
];

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

try {
  if (fs.existsSync(srcDir)) {
    console.log(`[copy-assets] Copying static assets from ${srcDir}...`);
    targets.forEach(target => {
      copyFolderSync(srcDir, target);
      console.log(`[copy-assets] Copied to ${target}`);
    });
  } else {
    console.log(`[copy-assets] Source directory ${srcDir} does not exist. Skipping copy.`);
  }

  // Copy compiled Vite client assets from dist/client to public for Vercel v2 static serving
  const distClientDir = path.resolve('dist/client');
  const publicDir = path.resolve('public');
  if (fs.existsSync(distClientDir)) {
    console.log(`[copy-assets] Copying compiled client assets from ${distClientDir} to ${publicDir}...`);
    
    // Copy dist/client/assets to public/assets
    const distAssets = path.join(distClientDir, 'assets');
    const publicAssets = path.join(publicDir, 'assets');
    
    // Clean public/assets first to prevent accumulation of stale hashed assets from old builds
    if (fs.existsSync(publicAssets)) {
      console.log(`[copy-assets] Cleaning stale assets from ${publicAssets}...`);
      fs.rmSync(publicAssets, { recursive: true, force: true });
    }

    if (fs.existsSync(distAssets)) {
      copyFolderSync(distAssets, publicAssets);
      console.log(`[copy-assets] Copied ${distAssets} to ${publicAssets}`);
    }

    // Copy dist/client root files (e.g. index.html, welcome_video.mp4, favicon.png) to public root
    fs.readdirSync(distClientDir).forEach(file => {
      const fromPath = path.join(distClientDir, file);
      const toPath = path.join(publicDir, file);
      if (fs.lstatSync(fromPath).isFile()) {
        fs.copyFileSync(fromPath, toPath);
      }
    });
    console.log('[copy-assets] Copied client root static files to public/');
  }
} catch (err) {
  console.error('[copy-assets] Error copying assets:', err);
}
