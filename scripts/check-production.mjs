async function checkPage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "DesignPick-HealthCheck/1.0" },
  });
  const html = await res.text();
  const r2 = (html.match(/images\.desigpick-digital\.com/g) || []).length;
  const unsplash = (html.match(/images\.unsplash\.com/g) || []).length;
  return { url, status: res.status, r2, unsplash };
}

const pages = [
  "https://www.desigpick-digital.com/demos/property-luxe-09",
  "https://www.desigpick-digital.com/demos/restaurant-warm-01",
];

for (const url of pages) {
  const r = await checkPage(url);
  console.log(`${url}`);
  console.log(`  HTTP ${r.status} | R2 refs: ${r.r2} | Unsplash refs: ${r.unsplash}`);
}
