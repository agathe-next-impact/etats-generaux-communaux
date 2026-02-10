#!/usr/bin/env node

/**
 * Test WordPress preview setup
 *
 * Usage:
 *   node scripts/test-preview-setup.js
 */

const https = require('https');
const http = require('http');

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://admin.lesetatsgenerauxcommunaux.org/wp-json/wp/v2';
const baseUrl = WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, '');

console.log('\n========================================');
console.log('WordPress Preview Setup Test');
console.log('========================================\n');

console.log('Testing WordPress API at:', baseUrl);
console.log('');

// Test 1: Check if headless-preview endpoint exists
console.log('Test 1: Checking headless-preview endpoint...');
const endpointUrl = `${baseUrl}/wp-json/headless-preview/v1/post-types`;

const protocol = endpointUrl.startsWith('https') ? https : http;

protocol.get(endpointUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const postTypes = JSON.parse(data);
        console.log('✓ Endpoint found!');
        console.log('\nAvailable post types:');

        Object.entries(postTypes).forEach(([name, info]) => {
          console.log(`  - ${name}: rest_base="${info.rest_base}"`);
        });

        // Check for expected CPTs
        console.log('\nChecking for expected CPTs:');
        const expectedCPTs = ['evenement', 'ressource', 'groupe-locaux'];

        expectedCPTs.forEach(cpt => {
          if (postTypes[cpt]) {
            console.log(`  ✓ ${cpt} - Found (rest_base: "${postTypes[cpt].rest_base}")`);
          } else {
            console.log(`  ✗ ${cpt} - NOT FOUND! Check that this CPT has show_in_rest=true`);
          }
        });

        // Test 2: Check environment variables
        console.log('\n\nTest 2: Checking environment variables...');

        if (process.env.WP_PREVIEW_SECRET) {
          console.log('  ✓ WP_PREVIEW_SECRET is set');
        } else {
          console.log('  ⚠ WP_PREVIEW_SECRET is not set (preview will work but without security)');
          console.log('    Run: node scripts/generate-preview-secret.js');
        }

        if (process.env.WP_PREVIEW_API || process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
          console.log('  ✓ WordPress API URL is configured');
        } else {
          console.log('  ✗ WordPress API URL is not configured');
        }

        console.log('\n========================================');
        console.log('Test Complete!');
        console.log('========================================\n');

      } catch (error) {
        console.log('✗ Invalid JSON response from endpoint');
        console.log('Response:', data.substring(0, 200));
      }
    } else {
      console.log(`✗ Endpoint returned status ${res.statusCode}`);
      console.log('\nThis means the headless-preview endpoint is not installed.');
      console.log('Follow the instructions in wordpress-integration/README-PREVIEW.md to install it.\n');
    }
  });
}).on('error', (err) => {
  console.log('✗ Error connecting to WordPress:');
  console.log(err.message);
  console.log('\nMake sure WordPress is accessible and the URL is correct.\n');
});
