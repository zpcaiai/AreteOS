"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

const W = 1080;
const H = 1350;

const TPL_ZH: Record<string, string> = { dawn: "黎明", sea: "海", olive: "橄榄", ink: "墨" };

const TEMPLATES = [
  { id: "dawn", name: "Dawn", stops: ["#182433", "#546179", "#d48b6a"], ink: "#fff7ec", sub: "rgba(255,247,236,0.72)" },
  { id: "sea", name: "Sea", stops: ["#071827", "#16405a", "#1f7687"], ink: "#eafaff", sub: "rgba(234,250,255,0.72)" },
  { id: "olive", name: "Olive", stops: ["#172214", "#3e5132", "#83945a"], ink: "#f6f8ec", sub: "rgba(246,248,236,0.72)" },
  { id: "ink", name: "Ink", stops: ["#0c0d12", "#23263a"], ink: "#f2ecdd", sub: "rgba(242,236,221,0.66)" },
];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  const tokens = text.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]|\S+|\s+/g) || [];
  for (const token of tokens) {
    const next = line + token;
    if (ctx.measureText(next).width > maxWidth && line.trim()) {
      lines.push(line.trimEnd());
      line = token.trimStart();
    } else {
      line = next;
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

function render(canvas: HTMLCanvasElement, args: { title: string; content: string; source?: string; tpl: (typeof TEMPLATES)[number] }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;
  const gradient = ctx.createLinearGradient(0, 0, W * 0.4, H);
  args.tpl.stops.forEach((color, index) => gradient.addColorStop(index / Math.max(1, args.tpl.stops.length - 1), color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let y = 40; y < H; y += 28) {
    for (let x = 30 + (y % 56); x < W; x += 56) ctx.fillRect(x, y, 2, 2);
  }

  ctx.strokeStyle = args.tpl.sub;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 90, 140);
  ctx.lineTo(W / 2 + 90, 140);
  ctx.stroke();

  const fontStack = '"EB Garamond","Noto Serif SC","Songti SC",Georgia,serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.font = `600 48px ${fontStack}`;
  ctx.fillStyle = args.tpl.sub;
  ctx.fillText(args.title, W / 2, 210);

  const maxWidth = W - 220;
  let fontSize = 62;
  let lines: string[] = [];
  for (; fontSize >= 34; fontSize -= 4) {
    ctx.font = `600 ${fontSize}px ${fontStack}`;
    lines = wrapText(ctx, args.content, maxWidth);
    if (lines.length * fontSize * 1.65 <= H - 620) break;
  }
  const lineH = fontSize * 1.65;
  const startY = Math.max(340, (H - lines.length * lineH) / 2 - 20);
  ctx.fillStyle = args.tpl.ink;
  lines.forEach((line, index) => ctx.fillText(line, W / 2, startY + index * lineH));

  ctx.font = `500 34px ${fontStack}`;
  ctx.fillStyle = args.tpl.sub;
  ctx.fillText(args.source ? `- ${args.source}` : "Arete", W / 2, startY + lines.length * lineH + 56);
}

export default function ShareCardModal({
  title,
  content,
  source,
  onClose,
}: {
  title: string;
  content: string;
  source?: string;
  onClose: () => void;
}) {
  const T = useT();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tplId, setTplId] = useState("dawn");
  const tpl = TEMPLATES.find((item) => item.id === tplId) || TEMPLATES[0];

  const repaint = useCallback(() => {
    if (canvasRef.current) render(canvasRef.current, { title, content, source, tpl });
  }, [title, content, source, tpl]);

  useEffect(() => {
    repaint();
    document.fonts?.ready.then(repaint).catch(() => undefined);
  }, [repaint]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${title.replace(/[^\w\u4e00-\u9fff-]+/g, "_") || "arete-card"}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  async function copyImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob || !("ClipboardItem" in window)) return;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur" onClick={onClose}>
      <section className="max-h-full w-full max-w-[420px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">{T("分享卡片", "Share card")}</h2>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800" aria-label={T("关闭分享卡片", "Close share card")}>✕</button>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <canvas ref={canvasRef} className="block w-full" />
        </div>
        <div className="my-3 grid grid-cols-4 gap-2">
          {TEMPLATES.map((item) => (
            <button
              key={item.id}
              onClick={() => setTplId(item.id)}
              className={`rounded-lg px-2 py-2 text-xs font-medium text-white ${tplId === item.id ? "ring-2 ring-indigo-400" : ""}`}
              style={{ background: `linear-gradient(135deg, ${item.stops[0]}, ${item.stops[item.stops.length - 1]})` }}>
              {T(TPL_ZH[item.id] ?? item.name, item.name)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={copyImage} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">{T("复制图片", "Copy image")}</button>
          <button onClick={download} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">{T("下载", "Download")}</button>
        </div>
      </section>
    </div>
  );
}

