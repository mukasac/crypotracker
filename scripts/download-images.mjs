import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';

const publicDir = path.join(process.cwd(), 'public');

const images = [
  { name: 'btc-icon.png' },
  { name: 'eth-icon.png' },
  { name: 'sol-icon.png' },
  { name: 'ada-icon.png' },
  { name: 'feature-signals.png'},
  { name: 'feature-risk.png'},
  { name: 'feature-timing.png'},
  
  { name: 'step1-icon.png' },
  { name: 'step2-icon.png' },
  { name: 'step3-icon.png' },
  { name: 'coinbase-logo.png' },
  { name: 'binance-logo.png' },
  { name: 'robinhood-logo.png' },
  { name: 'kraken-logo.png' },
  { name: 'gemini-logo.png' },
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
        
        fileStream.on('error', (error) => {
          fileStream.close();
          reject(error);
        });
      } else {
        response.resume(); // Consume response data
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (error) => {
      reject(new Error(`Network error while downloading ${url}: ${error.message}`));
    });
  });
}

async function setupPublicDirectory() {
  try {
    await fs.mkdir(publicDir, { recursive: true });
    console.log('Public directory created or already exists.');
    
    for (const image of images) {
      const filepath = path.join(publicDir, image.name);
      try {
        await downloadImage(image.url, filepath);
      } catch (error) {
        console.error(`Failed to download ${image.name}:`, error.message);
        continue;
      }
    }
    
    console.log('Image download process completed!');
  } catch (error) {
    console.error('Error setting up public directory:', error);
    process.exit(1);
  }
}

setupPublicDirectory();

