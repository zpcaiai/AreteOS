export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Arete">
      <defs>
        <linearGradient id="areteLogoGrad" x1="20" y1="10" x2="76" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#818cf8" /><stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="44" stroke="url(#areteLogoGrad)" strokeWidth="2.5" opacity="0.45" />
      <path d="M48 13 l2.1 4.3 4.7 .7 -3.4 3.3 .8 4.7 -4.2 -2.2 -4.2 2.2 .8 -4.7 -3.4 -3.3 4.7 -.7z" fill="url(#areteLogoGrad)" />
      <path d="M48 26 L30 70" stroke="url(#areteLogoGrad)" strokeWidth="6" strokeLinecap="round" />
      <path d="M48 26 L66 70" stroke="url(#areteLogoGrad)" strokeWidth="6" strokeLinecap="round" />
      <path d="M39 57 H57" stroke="url(#areteLogoGrad)" strokeWidth="5.5" strokeLinecap="round" />
      <g stroke="url(#areteLogoGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M22 78 C16 66 16 52 22 40" /><path d="M21 50 c-5 -1 -8 -4 -9 -8" /><path d="M20 58 c-5 -1 -8 -4 -9 -8" /><path d="M21 66 c-5 0 -9 -3 -10 -7" />
        <path d="M74 78 C80 66 80 52 74 40" /><path d="M75 50 c5 -1 8 -4 9 -8" /><path d="M76 58 c5 -1 8 -4 9 -8" /><path d="M75 66 c5 0 9 -3 10 -7" />
      </g>
    </svg>
  );
}
