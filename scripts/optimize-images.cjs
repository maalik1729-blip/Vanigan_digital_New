const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image configurations with their target dimensions
const images = [
  {
    name: 'loading-logo',
    input: 'public/assets/loading-logo-NaoJlZGV.png',
    outputs: [
      { width: 200, suffix: '' },
      { width: 400, suffix: '@2x' }
    ]
  },
  {
    name: 'temple-logo',
    input: 'public/assets/temple-logo-Byfbgmri.png',
    outputs: [
      { width: 400, suffix: '' },
      { width: 800, suffix: '@2x' }
    ]
  },
  {
    name: 'community',
    input: 'public/assets/community-eYUcaO9-.png',
    outputs: [
      { width: 256, suffix: '' },
      { width: 512, suffix: '@2x' }
    ]
  },
  {
    name: 'round-logo',
    input: 'public/assets/round-logo-DbsZApP4.png',
    outputs: [
      { width: 200, suffix: '' },
      { width: 400, suffix: '@2x' }
    ]
  },
  {
    name: 'trader1',
    input: 'public/assets/trader1-5W4ugSmI.png',
    outputs: [
      { width: 409, suffix: '' },
      { width: 818, suffix: '@2x' }
    ]
  },
  {
    name: 'trader2',
    input: 'public/assets/trader2-Bvwwwnus.png',
    outputs: [
      { width: 409, suffix: '' },
      { width: 818, suffix: '@2x' }
    ]
  },
  {
    name: 'trader3',
    input: 'public/assets/trader3-DtXUGZNP.png',
    outputs: [
      { width: 409, suffix: '' },
      { width: 818, suffix: '@2x' }
    ]
  }
];

// Flow images - all need to be resized from 1024x1024 to 60x60 (displayed size)
const flowImages = [
  'flow_become_organizer_1775026124.png',
  'flow_download_1775026063.png',
  'flow_help_support_1775026075.png',
  'flow_how_to_register_1775026438.png',
  'flow_refer_friend_1775026106.png',
  'flow_register_1775026021.png',
  'flow_request_loan_1775026153.png',
  'flow_view_card_1775026089.png',
  'flow_website_1775026047.png',
  'flow_wings_list_1775026034.png',
  'flow_your_members_1775026138.png'
].map(fileName => ({
  name: fileName.replace('.png', ''),
  input: `public/flow-images/${fileName}`,
  outputs: [
    { width: 60, suffix: '' },
    { width: 120, suffix: '@2x' }
  ]
}));

// Special handling for welcome banner (jpg)
const welcomeBanner = {
  name: 'flow_welcome_banner_1775048805',
  input: 'public/flow-images/flow_welcome_banner_1775048805.jpg',
  outputs: [
    { width: 768, suffix: '' },
    { width: 1536, suffix: '@2x' }
  ]
};

async function optimizeImage({ name, input, outputs }) {
  const parsed = path.parse(input);
  
  // Check if input file exists
  if (!fs.existsSync(input)) {
    console.log(`⚠️  Skipped: ${input} (not found)`);
    return;
  }

  const originalSize = fs.statSync(input).size;
  let totalSaved = 0;

  for (const { width, suffix } of outputs) {
    const outputDir = parsed.dir;
    const outputWebP = path.join(outputDir, `${name}${suffix}.webp`);
    const outputAvif = path.join(outputDir, `${name}${suffix}.avif`);

    try {
      // Generate WebP
      await sharp(input)
        .resize(width, width, { 
          fit: 'contain', 
          background: { r: 0, g: 0, b: 0, alpha: 0 } 
        })
        .webp({ quality: 85 })
        .toFile(outputWebP);
      
      const webpSize = fs.statSync(outputWebP).size;

      // Generate AVIF (best compression)
      await sharp(input)
        .resize(width, width, { 
          fit: 'contain', 
          background: { r: 0, g: 0, b: 0, alpha: 0 } 
        })
        .avif({ quality: 75 })
        .toFile(outputAvif);
      
      const avifSize = fs.statSync(outputAvif).size;
      
      totalSaved += (originalSize - Math.min(webpSize, avifSize));
      
      console.log(`  ✓ ${width}x${width}: ${path.basename(outputWebP)} (${(webpSize / 1024).toFixed(1)} KB)`);
      console.log(`  ✓ ${width}x${width}: ${path.basename(outputAvif)} (${(avifSize / 1024).toFixed(1)} KB)`);
    } catch (error) {
      console.error(`  ✗ Error processing ${name}${suffix}:`, error.message);
    }
  }

  const savingsPercent = ((totalSaved / originalSize) * 100).toFixed(1);
  console.log(`  💾 Savings: ${(totalSaved / 1024).toFixed(1)} KB (${savingsPercent}%)\n`);
  
  return totalSaved;
}

async function main() {
  console.log('🖼️  Starting Image Optimization\n');
  console.log('=' .repeat(60));
  
  let totalSavings = 0;

  // Optimize main images
  console.log('\n📦 Optimizing Main Images...\n');
  for (const img of images) {
    console.log(`Processing: ${img.name}`);
    const saved = await optimizeImage(img);
    if (saved) totalSavings += saved;
  }

  // Optimize flow images
  console.log('\n🔄 Optimizing Flow Images...\n');
  for (const img of flowImages) {
    console.log(`Processing: ${img.name}`);
    const saved = await optimizeImage(img);
    if (saved) totalSavings += saved;
  }

  // Optimize welcome banner
  console.log('\n🎉 Optimizing Welcome Banner...\n');
  console.log(`Processing: ${welcomeBanner.name}`);
  const bannerSaved = await optimizeImage(welcomeBanner);
  if (bannerSaved) totalSavings += bannerSaved;

  console.log('=' .repeat(60));
  console.log(`\n✅ Optimization Complete!`);
  console.log(`💾 Total Savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB\n`);
  console.log('📋 Next Steps:');
  console.log('  1. Update image references in code to use .webp/.avif');
  console.log('  2. Use <picture> elements for responsive images');
  console.log('  3. Add lazy loading to below-the-fold images');
  console.log('  4. Test in different browsers\n');
}

main().catch(console.error);
