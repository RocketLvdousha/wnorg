const slug = process.argv[2];
const res = await fetch(`http://localhost:3001/share/science/${slug}`);
console.log("status:", res.status);
const html = await res.text();
console.log("html length:", html.length);
// 找 article
const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
console.log("article content:", m?.[1]?.slice(0, 500) || "(none)");
