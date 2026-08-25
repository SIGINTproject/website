export function VlanTrunkLine({ label = "UPLINK" }: { label?: string }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-3 text-signal">
      <span className="font-label text-[0.625rem] font-semibold tracking-[0.18em]">{label}</span>
      <span className="relative h-px flex-1 bg-signal">
        <span className="absolute -top-1 right-1/4 size-2 border border-signal bg-paper" />
      </span>
    </div>
  );
}
