import Link from "next/link";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  children,
  className = "",
  external = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-sans font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer";

  const sizes = {
    sm: "text-xs px-5 py-2.5",
    md: "text-xs px-7 py-3.5",
    lg: "text-sm px-10 py-4",
  };

  const variants = {
    primary:
      "bg-forest-800 text-cream hover:bg-forest-700 border border-forest-800",
    outline:
      "bg-transparent text-forest-800 border border-forest-800 hover:bg-forest-800 hover:text-cream",
    ghost:
      "bg-transparent text-gold-500 border border-gold-500 hover:bg-gold-500 hover:text-white",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
