import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // ------- THEME (exactly your scheme) -------
  const Theme = () => (
    <style jsx global>{`
      :root {
        --primary: #FF6B00;      /* Orange */
        --secondary: #D4A5A5;    /* Soft Rose Gold */
        --background: #FFF8E6;   /* Cream */
        --text: #1A1A1A;
        --shadow: rgba(0,0,0,0.1);
      }
      .grain:before {
        content: "";
        position: absolute; inset: 0; pointer-events: none; opacity: 0.06;
        background-image: radial-gradient(#000 1px, transparent 1px);
        background-size: 3px 3px; mix-blend-mode: multiply;
      }
    `}</style>
  );

  const safeZone = { xMin: 22, xMax: 78, yMin: 12, yMax: 72 };

  function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  type Kernel = { x: number; y: number; size: number; rot: number; layer: "bg" | "mg" | "fg" };

  const kernels = useMemo<Kernel[]>(() => {
    const arr: Kernel[] = [];

    const addKernel = (k: Kernel) => {
      // Avoid safe zone (hero text + bowl)
      if (k.x > safeZone.xMin && k.x < safeZone.xMax && k.y > safeZone.yMin && k.y < safeZone.yMax) {
        k.y = k.y < 50 ? safeZone.yMin - rand(6, 12) : safeZone.yMax + rand(6, 12);
      }
      arr.push(k);
    };

    // Distribute more evenly across left and right
    for (let i = 0; i < 12; i++) addKernel({ x: rand(2, 48), y: rand(6, 94), size: rand(20, 40), rot: rand(0, 360), layer: i % 3 === 0 ? "fg" : i % 2 === 0 ? "mg" : "bg" });
    for (let i = 0; i < 12; i++) addKernel({ x: rand(52, 98), y: rand(6, 94), size: rand(20, 40), rot: rand(0, 360), layer: i % 3 === 0 ? "fg" : i % 2 === 0 ? "mg" : "bg" });

    return arr;
  }, []);

  const speedByLayer = { bg: 14, mg: 10, fg: 7 } as const;
  const zByLayer = { bg: 0, mg: 10, fg: 20 } as const;

  const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.0, ease: "easeOut", delay }
  });

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[var(--background)]">
      <Theme />

      {/* Alive Background */}
      <div className="absolute inset-0 -z-20 grain">
        <motion.div
          className="absolute -top-56 -left-56 w-[520px] h-[520px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, var(--secondary) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.36, 0.28] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-[-180px] w-[640px] h-[640px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 70%)" }}
          animate={{ rotate: [0, 20, -20, 0], opacity: [0.25, 0.33, 0.25] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 left-6 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--primary) 25%, var(--secondary) 50%) 0%, transparent 70%)" }}
          animate={{ x: [0, 16, -10, 0], y: [0, -10, 8, 0], opacity: [0.18, 0.26, 0.18] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, var(--secondary) 1px, transparent 1.2px)` , backgroundSize: '26px 26px' }}
          animate={{ backgroundPositionX: [0, 26, 0], backgroundPositionY: [0, -26, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Kernels */}
      {kernels.map((k, i) => (
        <motion.img
          key={i}
          src="/makhana.png"
          alt="Makhana kernel"
          className="absolute select-none"
          style={{
            width: `${k.size}px`,
            top: `${k.y}%`,
            left: `${k.x}%`,
            rotate: `${k.rot}deg`,
            zIndex: zByLayer[k.layer],
            filter: k.layer === "fg" ? "drop-shadow(0 6px 12px var(--shadow))" : "none"
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, y: [0, -20, 0], rotate: [k.rot, k.rot + 12, k.rot - 12, k.rot] }}
          transition={{ duration: speedByLayer[k.layer], repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
        />
      ))}

      {/* Center Content */}
      <motion.div
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        className="z-30 text-center flex flex-col items-center px-6 mt-[-14vh]"
      >
        <motion.p
          {...fadeInUp(0)}
          className="italic tracking-[0.28em] font-serif mb-3"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(16px, 1.8vw, 24px)', color: '#DEA193' }}
        >
          🌿 Wholesome • Crunchy • Guilt-Free
        </motion.p>

        <motion.h1
          {...fadeInUp(0.15)}
          className="mb-4 leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontVariationSettings: '"wght" 700', letterSpacing: '0.5px', fontSize: 'clamp(40px, 6vw, 84px)', color: '#773d22' }}
        >
          Pure <span className="italic" style={{ color: 'var(--primary)' }}>Makhana</span> from Nature's Heart
        </motion.h1>

        <motion.p
          {...fadeInUp(0.3)}
          className="max-w-2xl mb-8 md:mb-10"
          style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 'clamp(16px, 2vw, 20px)', color: '#959393' }}
        >
          Hand-picked makhana, slow-roasted with love. Elevate your snacking with nature's crunch.
        </motion.p>

        <motion.div {...fadeInUp(0.45)} className="flex justify-center">
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--primary)" }}
            whileTap={{ scale: 0.97, filter: "brightness(0.95)" }}
            className="px-12 py-4 rounded-full text-base md:text-lg font-medium text-white bg-[var(--primary)] text-center shadow-[6px_6px_12px_rgba(0,0,0,0.12),-6px_-6px_12px_rgba(255,255,255,0.6)]"
            style={{ fontFamily: 'Comfortaa, sans-serif' }}
          >
            Shop Now ⇀
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Bowl */}
      <motion.div
        initial={{ opacity: 0, y: 120, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
        className="absolute bottom-[-26%] w-full flex justify-center pointer-events-none z-20"
      >
        <img
          src="/makhana-bowl-top.png"
          alt="Bowl of Makhana"
          className="w-[46%] md:w-[34%]"
          style={{ filter: "drop-shadow(0 24px 40px var(--shadow))" }}
        />
      </motion.div>

      {/* Bulk Order CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.9 }}
        className="fixed bottom-[10%] right-6 md:right-10 backdrop-blur-xl bg-white/35 border border-white/50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-5 py-4 z-40"
        style={{ fontFamily: 'Comfortaa, sans-serif', color: 'var(--text)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[var(--primary)] text-xl">📦</span>
          <div className="leading-tight">
            <p className="font-semibold">Order Bulk</p>
            <p className="text-sm opacity-80">Premium supply for businesses</p>
          </div>
        </div>
      </motion.div>

      {/* Branding */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full flex items-center px-6 md:px-10 py-5 z-40"
      >
        <div className="text-2xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'Comfortaa, sans-serif' }}>MakhanaCo</div>
      </motion.nav>
    </section>
  );
}
