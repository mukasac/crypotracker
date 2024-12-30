import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';

const publicDir = path.join(process.cwd(), 'public');

const images = [
  { name: 'hero-illustration.png', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
  { name: 'btc-icon.png', url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025' },
  { name: 'eth-icon.png', url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025' },
  { name: 'sol-icon.png', url: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=025' },
  { name: 'ada-icon.png', url: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=025' },
  { name: 'feature-signals.png'},
  { name: 'feature-risk.png'},
  { name: 'feature-timing.png'},
  
  { name: 'step1-icon.png' },
  { name: 'step2-icon.png' },
  { name: 'step3-icon.png' },
  { name: 'early-access.png', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
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

