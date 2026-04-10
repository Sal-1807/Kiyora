import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'assets');
mkdirSync(OUT, { recursive: true });

function crc32(buf) {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = t[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = Buffer.from(data);
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(d.length);
  const c = Buffer.allocUnsafe(4); c.writeUInt32BE(crc32(Buffer.concat([t, d])));
  return Buffer.concat([len, t, d, c]);
}

function adler32(data) {
  let s1 = 1, s2 = 0;
  for (const b of data) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521; }
  return ((s2 << 16) | s1) >>> 0;
}

function storeDeflate(data) {
  const blocks = [];
  let pos = 0;
  while (pos < data.length) {
    const end = Math.min(pos + 65535, data.length);
    const slice = data.slice(pos, end);
    const hdr = Buffer.allocUnsafe(5);
    hdr[0] = end >= data.length ? 1 : 0;
    hdr.writeUInt16LE(slice.length, 1);
    hdr.writeUInt16LE(~slice.length & 0xffff, 3);
    blocks.push(hdr, Buffer.from(slice));
    pos = end;
  }
  const body = Buffer.concat(blocks);
  const a32 = Buffer.allocUnsafe(4); a32.writeUInt32BE(adler32(data));
  return Buffer.concat([Buffer.from([0x78, 0x01]), body, a32]);
}

function encodePNG(W, H, pixels) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;
  const raw = new Uint8Array(H*(1+W*4));
  for (let y=0;y<H;y++) {
    raw[y*(1+W*4)]=0;
    for (let x=0;x<W;x++) {
      const s=(y*W+x)*4, d=y*(1+W*4)+1+x*4;
      raw[d]=pixels[s]; raw[d+1]=pixels[s+1]; raw[d+2]=pixels[s+2]; raw[d+3]=pixels[s+3];
    }
  }
  return Buffer.concat([sig, chunk('IHDR',ihdr), chunk('IDAT',storeDeflate(raw)), chunk('IEND',Buffer.alloc(0))]);
}

function fillRoundRect(px, W, H, x0, y0, w, h, r, R, G, B) {
  for (let y=y0;y<y0+h;y++) for (let x=x0;x<x0+w;x++) {
    const tl=x<x0+r&&y<y0+r, tr=x>=x0+w-r&&y<y0+r;
    const bl=x<x0+r&&y>=y0+h-r, br=x>=x0+w-r&&y>=y0+h-r;
    if (tl&&(x-(x0+r))**2+(y-(y0+r))**2>r*r) continue;
    if (tr&&(x-(x0+w-r))**2+(y-(y0+r))**2>r*r) continue;
    if (bl&&(x-(x0+r))**2+(y-(y0+h-r))**2>r*r) continue;
    if (br&&(x-(x0+w-r))**2+(y-(y0+h-r))**2>r*r) continue;
    if (x<0||x>=W||y<0||y>=H) continue;
    const i=(y*W+x)*4; px[i]=R; px[i+1]=G; px[i+2]=B; px[i+3]=255;
  }
}

function fillCircle(px, W, H, cx, cy, rad, R, G, B, A=255) {
  for (let y=Math.max(0,cy-rad);y<=Math.min(H-1,cy+rad);y++)
    for (let x=Math.max(0,cx-rad);x<=Math.min(W-1,cx+rad);x++)
      if ((x-cx)**2+(y-cy)**2<=rad*rad) {
        const i=(y*W+x)*4; px[i]=R; px[i+1]=G; px[i+2]=B; px[i+3]=A;
      }
}

function makeIcon(size) {
  const W=size, H=size, px=new Uint8Array(W*H*4);
  const p=Math.round(size*.08), r=Math.round(size*.22);
  fillRoundRect(px,W,H,p,p,W-p*2,H-p*2,r,0x2D,0x8A,0x4E);
  const cx=Math.round(W/2), pinR=Math.round(size*.18);
  const pinTop=Math.round(H*.28), pinBot=Math.round(H*.72);
  fillRoundRect(px,W,H,cx-pinR,pinTop,pinR*2,pinR*2,pinR,255,255,255);
  for (let y=pinTop+pinR;y<=pinBot;y++) {
    const hw=Math.round(pinR*(1-(y-(pinTop+pinR))/(pinBot-(pinTop+pinR))));
    if(hw<=0) continue;
    for (let x=cx-hw;x<=cx+hw;x++) {
      if(x<0||x>=W||y<0||y>=H) continue;
      const i=(y*W+x)*4; px[i]=255; px[i+1]=255; px[i+2]=255; px[i+3]=255;
    }
  }
  fillCircle(px,W,H,cx,Math.round(pinTop+pinR),Math.round(pinR*.38),0x2D,0x8A,0x4E);
  return encodePNG(W,H,px);
}

writeFileSync(join(OUT,'icon.png'), makeIcon(1024));
writeFileSync(join(OUT,'adaptive-icon.png'), makeIcon(1024));
writeFileSync(join(OUT,'splash-icon.png'), makeIcon(200));
console.log('Assets generated in mobile/assets/');
