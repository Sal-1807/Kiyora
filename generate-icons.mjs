/**
 * Generates PNG icons for the PWA manifest.
 * Run once: node generate-icons.mjs
 * Requires: npm install sharp (temporary dev dependency)
 */
import { readFileSync, writeFileSync } from 'fs';

// Simple PNG generator using raw pixel data (no external deps needed)
// Creates a solid green square with a white map-pin shape

function createIconPNG(size) {
  const pixels = new Uint8Array(size * size * 4);
  const cx = size / 2, cy = size * 0.41;
  const pinW = size * 0.39, pinH = size * 0.58;
  const holeR = size * 0.09;
  const cornerR = size * 0.19;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Background color (green with rounded corners)
      const dx = Math.min(x, size - 1 - x);
      const dy = Math.min(y, size - 1 - y);
      const inCorner =
        dx < cornerR && dy < cornerR &&
        Math.hypot(dx - cornerR, dy - cornerR) > cornerR;

      if (inCorner) {
        // Transparent corner
        pixels[i] = pixels[i+1] = pixels[i+2] = pixels[i+3] = 0;
        continue;
      }

      // Background: Kiyora green
      let r = 45, g = 138, b = 78, a = 255;

      // Pin shape: teardrop — circle top + pointed bottom
      const nx = x - cx, ny = y - (cy - pinH * 0.18);
      const pinTop = pinW * 0.5;
      const distTop = Math.hypot(nx, ny + pinH * 0.1);
      const inCircle = distTop < pinTop;

      // Teardrop bottom: lines converge to point
      const pinBottom = cy + pinH * 0.52;
      const slope = pinTop / (pinBottom - (cy - pinH * 0.18 + pinH * 0.1));
      const halfW = slope * (pinBottom - y);
      const inBottom = y > cy - pinH * 0.18 + pinH * 0.1 && y < pinBottom && Math.abs(nx) < halfW;

      if (inCircle || inBottom) {
        r = 255; g = 255; b = 255; // white pin
      }

      // Hole in pin
      const distHole = Math.hypot(x - cx, y - cy);
      if (distHole < holeR) {
        r = 45; g = 138; b = 78; // green hole
      }

      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = a;
    }
  }

  return encodePNG(pixels, size, size);
}

// Minimal PNG encoder (DEFLATE-free, filter type 0)
function encodePNG(pixels, w, h) {
  const sig = [137,80,78,71,13,10,26,10];
  const IHDR = chunk('IHDR', pack32(w), pack32(h), [8,2,0,0,0]);
  const rows = [];
  for (let y = 0; y < h; y++) {
    rows.push(0); // filter none
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      rows.push(pixels[i], pixels[i+1], pixels[i+2]); // RGB only (drop alpha for simplicity)
    }
  }
  const IDAT = chunk('IDAT', zlibDeflate(new Uint8Array(rows)));
  const IEND = chunk('IEND');
  const out = [...sig, ...IHDR, ...IDAT, ...IEND];
  return Buffer.from(out);
}

function pack32(n) { return [(n>>24)&255,(n>>16)&255,(n>>8)&255,n&255]; }

function chunk(type, ...data) {
  const typeBytes = [...type].map(c => c.charCodeAt(0));
  const body = [...typeBytes, ...data.flat()];
  const len = pack32(body.length - 4);
  const crcVal = crc32(new Uint8Array(body));
  return [...len, ...body, ...pack32(crcVal)];
}

function crc32(data) {
  let crc = 0xffffffff;
  const table = crc32Table();
  for (const b of data) crc = (crc >>> 8) ^ table[(crc ^ b) & 255];
  return (crc ^ 0xffffffff) >>> 0;
}
function crc32Table() {
  const t = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t.push(c >>> 0);
  }
  return t;
}

// Minimal zlib wrapper (store/no-compression, valid for PNG)
function zlibDeflate(data) {
  const CMF = 0x78, FLG = 0x01; // zlib header, no compression
  const out = [CMF, FLG];
  let pos = 0;
  while (pos < data.length) {
    const end = Math.min(pos + 65535, data.length);
    const last = end === data.length ? 1 : 0;
    const len = end - pos;
    out.push(last, len & 255, (len >> 8) & 255, ~len & 255, (~len >> 8) & 255);
    for (let i = pos; i < end; i++) out.push(data[i]);
    pos = end;
  }
  // Adler-32
  let s1 = 1, s2 = 0;
  for (const b of data) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521; }
  const adler = (s2 << 16) | s1;
  out.push((adler >> 24) & 255, (adler >> 16) & 255, (adler >> 8) & 255, adler & 255);
  return out;
}

// Generate and save
writeFileSync('public/icon-192.png', createIconPNG(192));
writeFileSync('public/icon-512.png', createIconPNG(512));
writeFileSync('public/icon-maskable.png', createIconPNG(512));
console.log('✅ Icons generated: icon-192.png, icon-512.png, icon-maskable.png');
