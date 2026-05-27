// Pre-warming script to prime the Astro SSR SWR caches and image optimizer on container boot
setTimeout(() => {
  console.log('[PreWarm] Initiating background cache warming for /globant-demo...');
  fetch('http://localhost:3001/globant-demo')
    .then(res => {
      console.log('[PreWarm] Cache warming request completed! Status:', res.status);
    })
    .catch(err => {
      console.error('[PreWarm] Cache warming request failed:', err.message);
    });
}, 8000);
