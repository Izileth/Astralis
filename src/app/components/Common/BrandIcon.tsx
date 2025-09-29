
import { Link } from 'react-router-dom';

// Logo.tsx
// Versão com ênfase tipográfica no "A" como em sites de redação/editoriais.

type LogoProps = {
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'classic' | 'gradient' | 'minimal';
  ariaLabel?: string;
};

const sizeMap: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
};

export default function Logo({ href = '/', size = 'md', variant = 'classic', ariaLabel = 'Astralis — plataforma de artigos sobre carros' }: LogoProps) {
  const textSize = sizeMap[size] || sizeMap['md'];

  const variantClass = {
    classic: 'font-extrabold text-red-600',
    gradient: 'font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500 to-red-400',
    minimal: 'font-semibold text-neutral-900 border-b-2 border-red-600',
  }[variant];

  return (
    <div className="flex  items-center gap-2">
      <Link
        to={href}
        aria-label={ariaLabel}
        className="flex flex-col  items-start gap-2 no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {/* Destaque no "A" inicial */}
        <span className={`flex items-baseline ${textSize}`}>
          <span className="text-red-600 font-black text-3xl leading-none mr-0.5">A</span>
          <span className={`${variantClass} leading-tight`}>stralis</span>
        </span>
        <span className="text-xs text-neutral-500 -mt-2">Artigos & Reviews</span>
      </Link>
    </div>
  );
}

/*
Como usar:
<Logo href="/" size="lg" variant="classic" />
<Logo href="/" size="xl" variant="gradient" />
<Logo href="/" size="md" variant="minimal" />

Diferencial: o "A" inicial sempre vem destacado com peso e cor forte, lembrando marcas editoriais.
*/
