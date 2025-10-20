import { motion } from "framer-motion";

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-8 w-16 bg-[rgba(243,244,246,0.8)] shadow-sm rounded-[2px] mix-blend-multiply ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.0) 60%), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px)",
      }}
    />
  );
}

function Paper({ children, className = "", as: As = motion.div, rotate = 0, tint = "#f6f6f3" }: any) {
  return (
    <As
      whileHover={{ y: -6, rotate: rotate * 0.15, boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={`relative rounded-[10px] border p-4 shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${className}`}
      style={{
        backgroundColor: tint,
        backgroundImage:
          "radial-gradient(120% 80% at 10% 0%, rgba(255,255,255,0.9), rgba(0,0,0,0) 60%), radial-gradient(120% 80% at 100% 100%, rgba(255,255,255,0.75), rgba(0,0,0,0) 60%)",
        rotate,
      }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[10px]" style={{
        backgroundImage:
          "radial-gradient(100% 100% at 50% 0%, rgba(0,0,0,0.04), transparent 60%), radial-gradient(100% 100% at 0% 100%, rgba(0,0,0,0.03), transparent 60%)",
      }} />
      {children}
    </As>
  );
}

function Polaroid({ src, caption, rotate = -1.5 }: { src: string; caption?: string; rotate?: number }) {
  return (
    <Paper className="p-0" rotate={rotate} tint="#fafaf8">
      <div className="rounded-[10px] bg-white p-2">
        <div className="bg-zinc-100 rounded-[6px] overflow-hidden">
          <img src={src} alt={caption || "polaroid"} className="block w-full h-40 object-cover" />
        </div>
        <p className="mt-2 px-1 pb-1 text-[11px] text-muted-foreground font-medium">{caption}</p>
      </div>
      <Tape className="-top-3 left-6 rotate-[-8deg]" />
    </Paper>
  );
}

export default function Collage() {
  return (
    <div className="mt-10 grid grid-cols-12 gap-4 md:gap-6">
      {/* Left column */}
      <div className="col-span-12 md:col-span-4 space-y-4">
        <Paper rotate={-1} className="bg-[#f3f5f8]">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Notes about me</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Always learning, making, and refining.</li>
            <li>I care about taste, clarity, and calm.</li>
            <li>I like when things feel simple but alive.</li>
            <li>Creating keeps me grounded.</li>
          </ul>
          <Tape className="-top-3 right-6 rotate-[6deg]" />
        </Paper>
        <Polaroid src="https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F9e30fe9c38e24e489c7e51e7909a61fe" caption="Headphones — focus mode" rotate={1.2} />
      </div>

      {/* Middle column */}
      <div className="col-span-12 md:col-span-5 space-y-4">
        <Paper rotate={0.6} className="bg-[#f7f6f2]">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Things I’m into right now</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Currently: dance, running, and videography.</li>
            <li>Inspired by: quiet design, rhythm, solitude.</li>
            <li>Just get started.</li>
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-[hsl(var(--primary)/0.55)] border" />
            <span className="h-6 w-6 rounded bg-[hsl(var(--secondary)/0.55)] border" />
            <span className="h-6 w-6 rounded bg-[#d9e1ea] border" />
            <span className="h-6 w-6 rounded bg-[#e9e3d7] border" />
            <span className="h-6 w-6 rounded bg-[#c7ced6] border" />
          </div>
          <Tape className="-top-3 left-8 rotate-[-4deg]" />
        </Paper>
        <Polaroid src="https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Ffd307f7fb87e46dea122c2c8e63ad1e3" caption="Sneakers — foggy run" rotate={-2.2} />
      </div>

      {/* Right column */}
      <div className="col-span-12 md:col-span-3 space-y-4">
        <Paper rotate={-0.8} className="bg-[#f5f7fa]">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Reflections / Quotes</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Happiness is peace in motion.</li>
            <li>Read what you love until you love to read.</li>
            <li>Calm mind, clear work.</li>
            <li>All great things start as play.</li>
            <li>Be present, not productive.</li>
          </ul>
        </Paper>
        <Paper rotate={1.8} className="p-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fb4981084e6f548f79edd34c62c69a83e"
            alt="Keep going"
            className="block w-full rounded-md object-cover"
          />
          <Tape className="-top-3 right-4 rotate-[10deg]" />
        </Paper>
      </div>
    </div>
  );
}
