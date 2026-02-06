import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = join(__dirname, '..', 'public', 'icons');

// Ensure directory exists
if (!existsSync(iconDir)) {
  mkdirSync(iconDir, { recursive: true });
}

// Read SVG
const svgPath = join(iconDir, 'icon.svg');
const svgBuffer = readFileSync(svgPath);

// Generate icons for each size
async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = join(iconDir, `icon-${size}x${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${size}x${size}`);
  }

  // Also generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(iconDir, 'apple-touch-icon.png'));

  console.log('✓ Generated apple-touch-icon (180x180)');

  // Generate favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(iconDir, 'favicon-32x32.png'));

  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(join(iconDir, 'favicon-16x16.png'));

  console.log('✓ Generated favicons');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
