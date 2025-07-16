#!/usr/bin/env node

/**
 * Performance testing script for College Memory Gallery
 * This script runs performance tests on key pages and reports metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

// Configuration
const BASE_URL = 'http://localhost:3000';
const PAGES_TO_TEST = [
  '/',
  '/gallery',
  '/friends',
  '/sports',
  '/funny-moments',
  '/profile'
];
const OUTPUT_DIR = path.join(__dirname, '../performance-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Format date for report naming
const getFormattedDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
};

// Run Lighthouse test for a page
async function runLighthouseTest(url) {
  console.log(`\nTesting ${url}...`);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
    }
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Save report
  const reportName = `${url.replace(/\//g, '-').replace(/^-/, '')}-${getFormattedDate()}`;
  const reportPath = path.join(OUTPUT_DIR, `${reportName}.html`);
  fs.writeFileSync(reportPath, runnerResult.report);
  
  await chrome.kill();
  
  // Return key metrics
  const { performance, accessibility, 'best-practices': bestPractices, seo } = runnerResult.lhr.categories;
  
  return {
    url,
    scores: {
      performance: performance.score * 100,
      accessibility: accessibility.score * 100,
      bestPractices: bestPractices.score * 100,
      seo: seo.score * 100
    },
    metrics: {
      FCP: runnerResult.lhr.audits['first-contentful-paint'].numericValue,
      LCP: runnerResult.lhr.audits['largest-contentful-paint'].numericValue,
      TBT: runnerResult.lhr.audits['total-blocking-time'].numericValue,
      CLS: runnerResult.lhr.audits['cumulative-layout-shift'].numericValue,
      TTI: runnerResult.lhr.audits['interactive'].numericValue
    },
    reportPath
  };
}

// Main function
async function main() {
  console.log('🚀 Starting performance tests...');
  console.log('-------------------------------');
  
  // Check if development server is running
  try {
    execSync('curl -s http://localhost:3000 > /dev/null');
  } catch (error) {
    console.error('❌ Error: Development server is not running. Please start it with "npm run dev"');
    process.exit(1);
  }
  
  const results = [];
  
  // Test each page
  for (const page of PAGES_TO_TEST) {
    try {
      const result = await runLighthouseTest(`${BASE_URL}${page}`);
      results.push(result);
      
      // Log results
      console.log(`\n📊 Results for ${page}:`);
      console.log(`  Performance: ${result.scores.performance.toFixed(1)}%`);
      console.log(`  Accessibility: ${result.scores.accessibility.toFixed(1)}%`);
      console.log(`  Best Practices: ${result.scores.bestPractices.toFixed(1)}%`);
      console.log(`  SEO: ${result.scores.seo.toFixed(1)}%`);
      console.log(`  LCP: ${(result.metrics.LCP / 1000).toFixed(2)}s`);
      console.log(`  CLS: ${result.metrics.CLS.toFixed(3)}`);
      console.log(`  Report saved to: ${result.reportPath}`);
    } catch (error) {
      console.error(`❌ Error testing ${page}:`, error);
    }
  }
  
  // Generate summary report
  const summaryPath = path.join(OUTPUT_DIR, `summary-${getFormattedDate()}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  
  console.log('\n✅ Performance testing completed!');
  console.log(`📝 Summary report saved to: ${summaryPath}`);
  
  // Calculate average scores
  const avgPerformance = results.reduce((sum, r) => sum + r.scores.performance, 0) / results.length;
  const avgAccessibility = results.reduce((sum, r) => sum + r.scores.accessibility, 0) / results.length;
  const avgBestPractices = results.reduce((sum, r) => sum + r.scores.bestPractices, 0) / results.length;
  const avgSeo = results.reduce((sum, r) => sum + r.scores.seo, 0) / results.length;
  
  console.log('\n📈 Average Scores:');
  console.log(`  Performance: ${avgPerformance.toFixed(1)}%`);
  console.log(`  Accessibility: ${avgAccessibility.toFixed(1)}%`);
  console.log(`  Best Practices: ${avgBestPractices.toFixed(1)}%`);
  console.log(`  SEO: ${avgSeo.toFixed(1)}%`);
}

main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 