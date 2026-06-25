export default function EmptyState({
  title = "Nothing here yet",
  note = "New writing is being prepared for this section. Check back soon — fresh essays and definitions are on their way.",
}: {
  title?: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-line bg-card/60 px-6 py-14 text-center">
      <p className="tag-cap mb-3">UX Dictionary</p>
      <p className="font-display text-2xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-moss">{note}</p>
    </div>
  );
}
