interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`text-xs font-sans font-semibold tracking-[0.25em] uppercase mb-4 ${
            light ? "text-gold-400" : "text-gold-500"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-4xl md:text-5xl font-serif font-light leading-tight ${
          light ? "text-cream" : "text-forest-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-base font-sans leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-forest-100" : "text-stone"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
