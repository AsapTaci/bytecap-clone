import { Sparkles } from "lucide-react";

export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="text-[18px] font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-[13.5px] leading-6 text-white/45">
        {description}
      </p>
    </div>
  );
}
