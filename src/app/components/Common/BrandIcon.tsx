import { Link } from "react-router-dom";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "classic" | "minimal";
  ariaLabel?: string;
  showText?: boolean; // se quiser exibir apenas o ícone
};

const sizeMap: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

export default function Logo({
  href = "/",
  size = "md",
  variant = "classic",
  ariaLabel = "Pauta Livre — jornalismo independente",
  showText = true,
}: LogoProps) {
  const textSize = sizeMap[size] || sizeMap["md"];

  const variantClass =
    {
      classic: "font-bold text-neutral-900",
      minimal: "font-semibold text-neutral-800 tracking-tight",
    }[variant] || "font-bold text-neutral-900";

  return (
    <div className="flex items-center gap-2 select-none">
      <Link
        to={href}
        aria-label={ariaLabel}
        className="flex items-center gap-2 no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-800"
      >
        {/* Ícone geométrico minimalista */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-6 h-6 md:w-8 md:h-8"
          fill="none"
          stroke="black"
          strokeWidth="8"
        >
          <rect x="8" y="8" width="84" height="84" />
          <line x1="8" y1="92" x2="92" y2="8" />
        </svg>

        {/* Texto da marca */}
        {showText && (
          <span className={`uppercase ${variantClass} ${textSize}`}>
            <span className="font-extrabold text-red-600">Pauta</span> Livre
          </span>
        )}
      </Link>
    </div>
  );
}

/*
Como usar:

<Logo href="/" size="lg" variant="classic" />
<Logo href="/" size="xl" variant="minimal" />
<Logo href="/" showText={false} /> // Apenas o ícone geométrico

👉 O ícone SVG é vetorizado, monocromático e escalável.
👉 Pode ser facilmente adaptado a dark mode com stroke="currentColor".
*/
