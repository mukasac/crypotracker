import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const logos = [
  { name: 'coinbase-logo.png', url: 'https://cryptologos.cc/logos/coinbase-coin-coin-logo.png' },
  { name: 'binance-logo.png', url: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' },
  { name: 'robinhood-logo.png', url: 'https://cryptologos.cc/logos/robinhood-logo.png' },
  { name: 'kraken-logo.png', url: 'https://cryptologos.cc/logos/kraken-logo.png' },
  { name: 'gemini-logo.png', url: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png' },
];

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));
  console.log(`Downloaded: ${filepath}`);
}

async function main() {
  const publicFolder = path.join(process.cwd(), 'public');
  
  for (const logo of logos) {
    const filepath = path.join(publicFolder, logo.name);
    await downloadImage(logo.url, filepath);
  }

  console.log('All exchange logos downloaded successfully!');
}

main().catch(console.error);

