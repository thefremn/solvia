import Image from "next/image";
import { ArrowRightLeft, Check, MessagesSquare } from "lucide-react";

const HIGHLIGHTS = [
  {
    title: "One script tag adds live chat to any site",
    description: "Placeholder: floating bubble loaded in an iframe.",
  },
  {
    title: "AI answers first from your knowledge base",
    description: "Placeholder: GPT-4o-mini with per-org RAG.",
  },
  {
    title: "Escalates to a human when it matters",
    description: "Placeholder: full history carries over.",
  },
];

export const AuthBrandPanel = () => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0F2D52] text-white">
      {/* base gradient + dot texture — structural only, colors from DESIGN.md */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_10%,rgba(18,124,221,0.35),transparent),radial-gradient(500px_500px_at_90%_95%,rgba(18,124,221,0.25),transparent),linear-gradient(to_bottom,#0F2D52,#0A2240)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="relative flex h-full min-h-0 flex-col gap-5 p-8 xl:gap-6 xl:p-10">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white p-1.5">
            <Image src="/logo.svg" alt="Solvia logo" width={24} height={24} />
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            Solvia
          </span>
        </div>

        <div className="flex max-w-md flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#EBF5FF] uppercase">
            <span className="size-1.5 rounded-full bg-brand-accent" />
            AI-powered customer support
          </p>
          <h1 className="text-[32px] leading-[1.1] font-bold tracking-tight text-white xl:text-4xl">
            AI answers first.
            <br />
            <span className="font-serif font-normal text-[#EBF5FF] italic">
              Humans step in
            </span>{" "}
            when it matters.
          </h1>
          <p className="max-w-sm text-sm leading-5 text-white/70">
            One script tag adds live chat. AI answers from your knowledge base,
            then escalates to a human with full context.
          </p>
        </div>

        <ul className="flex max-w-md flex-col gap-2">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/5">
                <Check className="size-3.5 text-[#EBF5FF]" strokeWidth={3} />
              </span>
              <span className="text-sm leading-5 font-medium text-white/85">
                {item.title}
              </span>
            </li>
          ))}
        </ul>

        <div className="relative mt-auto hidden min-h-32 shrink-0 xl:block">
          <style>{`@keyframes auth-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } } @keyframes auth-float-soft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }`}</style>
          {/* top floating preview — structure from inspiration, Solvia copy only */}
          <div className="absolute top-0 right-6 w-72 animate-[auth-float_6s_ease-in-out_infinite] rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-xl backdrop-blur-md motion-reduce:animate-none">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-brand-accent">
                <MessagesSquare className="size-3.5 text-white" />
              </span>
              <p className="text-xs font-semibold text-white">Live chat</p>
              <span className="ml-auto text-[11px] text-white/50">now</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <p className="w-fit max-w-full rounded-lg rounded-tl-sm bg-white/10 px-2.5 py-1.5 text-xs text-white/85">
                Do you offer weekend support?
              </p>
              <p className="ml-auto w-fit max-w-full rounded-lg rounded-tr-sm bg-brand-accent-fill px-2.5 py-1.5 text-xs font-medium text-white">
                Yes — from your help center. Want a human to follow up?
              </p>
            </div>
          </div>

          {/* bottom floating preview */}
          <div className="absolute bottom-0 right-24 flex w-60 animate-[auth-float-soft_7s_ease-in-out_1.2s_infinite] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-2.5 shadow-xl backdrop-blur-md motion-reduce:animate-none">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#EBF5FF]/10">
              <ArrowRightLeft className="size-4 text-[#EBF5FF]" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-white">
                Handoff to operator
              </p>
              <p className="text-[11px] leading-4 text-white/55">
                Transcript + context included
              </p>
            </div>
          </div>
        </div>

        <p className="relative pt-1 text-[11px] leading-4 text-white/45">
          © 2026 Solvia · Real-time operator dashboard
        </p>
      </div>
    </div>
  );
};
