import { useEffect, useRef } from 'react';

export default function BackgroundFX() {
  const ref = useRef(null);

  useEffect(() => {
    const draw = () => {
      if (!ref.current) return;
      const charW = 8;   // tune with font-size
      const charH = 14;  // tune with line-height
      const cols = Math.ceil(window.innerWidth / charW);
      const rows = Math.ceil(window.innerHeight / charH);
      const t = Date.now() * 0.0006;

      let out = '';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = Math.sin(x * 0.15 + t) + Math.cos(y * 0.20 - t);
          out += v > 0.6 ? '@' : v > 0.2 ? '#' : v > -0.2 ? '*' : v > -0.6 ? ':' : '.';
        }
        out += '\n';
      }
      ref.current.textContent = out;
    };

    draw();
    const id = setInterval(draw, 60);
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => { clearInterval(id); window.removeEventListener('resize', onResize); };
  }, []);

  return <pre ref={ref} className="ascii-bg" aria-hidden="true" />;
}
