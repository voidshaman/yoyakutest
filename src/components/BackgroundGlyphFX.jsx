import { useEffect, useRef } from 'react';

const GLYPHS = [
  '/glyphs/INTERWAVE_GLYPHS-01.svg',
  '/glyphs/INTERWAVE_GLYPHS-02.svg',
  '/glyphs/INTERWAVE_GLYPHS-03.svg',
  '/glyphs/INTERWAVE_GLYPHS-04.svg',
  '/glyphs/INTERWAVE_GLYPHS-05.svg',
  '/glyphs/INTERWAVE_GLYPHS-06.svg',
  '/glyphs/INTERWAVE_GLYPHS-07.svg',
  '/glyphs/INTERWAVE_GLYPHS-08.svg',
];

// utils
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const mapv = (v,i0,i1,o0,o1)=>o0+((v-i0)/(i1-i0))*(o1-o0);
const easeInOutQuad = (t)=> (t<0.5?2*t*t:-1+(4-2*t)*t);

class FrameLoop {
  constructor(len, outMin, outMax, pingpong=true, ease=easeInOutQuad){
    this.len=Math.max(2,len|0); this.i=0; this.dir=1;
    this.outMin=outMin; this.outMax=outMax; this.pingpong=pingpong; this.ease=ease;
  }
  set(i){ this.i=clamp(i|0,0,this.len-1); }
  inc(){
    if(this.pingpong){ this.i+=this.dir;
      if(this.i>=this.len-1){ this.i=this.len-1; this.dir=-1; }
      else if(this.i<=0){ this.i=0; this.dir=1; }
    } else this.i=(this.i+1)%this.len;
  }
  get value(){ const t=this.i/(this.len-1); return mapv(this.ease(t),0,1,this.outMin,this.outMax); }
}

export default function BackgroundGlyphFX(){
  const wrapRef = useRef(null);

  useEffect(()=> {
    if (!wrapRef.current) return;

    const FRAMES = 15;
    const BLUR_STEPS = 6;
    const CELL_W = 1;   // tune density
    const CELL_H = 1;

    const el = wrapRef.current;
    let rows=0, cols=0;
    let waveMap=[]; // FrameLoop[][]
    let nodes=[];   // divs
    let raf=0;

    const create2D=(r,c,fill=0)=>Array.from({length:r},()=>Array(c).fill(fill));

    function setup(){
      const vw = window.innerWidth, vh = window.innerHeight;
      cols = Math.max(4, Math.ceil(vw / CELL_W));
      rows = Math.max(4, Math.ceil(vh / CELL_H));

      el.style.setProperty('--cols', cols);
      el.style.setProperty('--cell-w', `${CELL_W}px`);
      el.style.setProperty('--cell-h', `${CELL_H}px`);
      el.innerHTML = '';

      const frag = document.createDocumentFragment();
      nodes = [];
      for(let i=0;i<rows*cols;i++){
        const d=document.createElement('div');
        d.className='glyph-cell';
        const url=GLYPHS[i % GLYPHS.length];
        d.style.webkitMaskImage=`url(${url})`;
        d.style.maskImage=`url(${url})`;
        d.dataset.u=url;
        frag.appendChild(d);
        nodes.push(d);
      }
      el.appendChild(frag);

      const MAX = GLYPHS.length * 2 - 2;
      waveMap = create2D(rows, cols, 0);
      for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) waveMap[y][x]=Math.random()*MAX;

      for(let s=0;s<BLUR_STEPS;s++){
        for(let y=0;y<rows;y++){
          for(let x=0;x<cols;x++){
            const v=waveMap[y][x];
            const l=waveMap[y][x-(x>0?1:0)];
            const r=waveMap[y][x+(x<cols-1?1:0)];
            const t=waveMap[y-(y>0?1:0)][x];
            const b=waveMap[y+(y<rows-1?1:0)][x];
            waveMap[y][x]=(v+l+r+t+b)/5;
          }
        }
      }

      let vmin=Infinity,vmax=-Infinity;
      for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ vmin=Math.min(vmin,waveMap[y][x]); vmax=Math.max(vmax,waveMap[y][x]); }

      for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
          const seed = Math.floor(mapv(waveMap[y][x], vmin, vmax, 0, FRAMES));
          const loop = new FrameLoop(FRAMES, 0, GLYPHS.length-1, true, easeInOutQuad);
          loop.set(seed);
          waveMap[y][x]=loop;
        }
      }
    }

    function draw(){
      let i=0;
      for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
          const loop=waveMap[y][x];
          const idx=Math.round(loop.value)%GLYPHS.length;
          const node=nodes[i++];
          const url=GLYPHS[idx];
          if(node.dataset.u!==url){
            node.style.webkitMaskImage=`url(${url})`;
            node.style.maskImage=`url(${url})`;
            node.dataset.u=url;
          }
          const t=loop.i/(loop.len-1);
          node.style.opacity=(0.10+0.10*Math.sin(t*Math.PI*2)).toFixed(3);
          loop.inc();
        }
      }
      raf=requestAnimationFrame(draw);
    }

    function onResize(){ cancelAnimationFrame(raf); setup(); raf=requestAnimationFrame(draw); }

    setup();
    raf=requestAnimationFrame(draw);
    window.addEventListener('resize', onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <div ref={wrapRef} className="glyph-bg" aria-hidden="true" />;
}
