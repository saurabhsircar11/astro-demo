import http from 'http';

const TARGET_URL = 'http://localhost:3001/globant-demo';
const NUM_REQUESTS = 5;

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const end = performance.now();
        const duration = end - start;
        const xResponseTime = res.headers['x-response-time'];
        resolve({
          statusCode: res.statusCode,
          durationMs: duration,
          xResponseTime,
          length: data.length,
          content: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runBenchmark() {
  console.log('----------------------------------------------------');
  console.log(`Starting Benchmark against Astro SSR (Live Google Doc):`);
  console.log(`URL: ${TARGET_URL}`);
  console.log('----------------------------------------------------');

  for (let i = 1; i <= NUM_REQUESTS; i++) {
    try {
      const result = await makeRequest(TARGET_URL);
      console.log(`Request #${i}:`);
      console.log(`  Status Code      : ${result.statusCode}`);
      console.log(`  Total Client RT  : ${result.durationMs.toFixed(2)} ms`);
      console.log(`  Server SSR Time  : ${result.xResponseTime}`);
      console.log(`  Body Size        : ${result.length} bytes`);
      
      // Basic HTML sanity checks
      if (i === 1) {
        const hasHero = result.content.includes('OFFICIAL FIFA WORLD CUP 2026');
        const hasTwoCol = result.content.includes('Meet Globant AI Pods');
        const hasStudios = result.content.includes('AI Studios');
        const hasLogoScroll = result.content.includes('logoscroll__logo');
        const hasCSS = result.content.includes('/* Component: TwoColumn */');
        
        console.log('\n  Markup Verification:');
        console.log(`    - FIFA Hero section present : ${hasHero ? 'YES' : 'NO'}`);
        console.log(`    - TwoColumn section present : ${hasTwoCol ? 'YES' : 'NO'}`);
        console.log(`    - AI Studios present        : ${hasStudios ? 'YES' : 'NO'}`);
        console.log(`    - Logo Scroll marquee present: ${hasLogoScroll ? 'YES' : 'NO'}`);
        console.log(`    - Inlined CSS present       : ${hasCSS ? 'YES' : 'NO'}`);
        console.log('----------------------------------------------------');
      }
    } catch (err) {
      console.error(`  Request #${i} failed:`, err.message);
    }
    // Small sleep
    await new Promise(r => setTimeout(r, 200));
  }
}

// Delay benchmark slightly to ensure server is ready if launched inline
setTimeout(runBenchmark, 1000);
