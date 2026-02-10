#!/usr/bin/env node

/**
 * Generate a secure random secret for WordPress preview
 *
 * Usage:
 *   node scripts/generate-preview-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n========================================');
console.log('WordPress Preview Secret Generated');
console.log('========================================\n');
console.log('Add this to your .env.local file:\n');
console.log(`WP_PREVIEW_SECRET=${secret}\n`);
console.log('And add this to your WordPress wp-config.php:\n');
console.log(`define('WP_PREVIEW_SECRET', '${secret}');\n`);
console.log('========================================\n');
