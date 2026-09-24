"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import SacredBackdrop from '../ui/SacredBackdrop';
import { ChevronRight } from '../../utils/icons';
import { fadeUp } from '../../utils/motion';
import { useAstroBase, useAstroHref } from '../../context/AstroBase';

export default function PageHeader({ eyebrow, title, subtitle, children }) {
  const base = useAstroBase();
  const href = useAstroHref();
  return (
    <section className={`relative overflow-hidden pb-10 ${base ? 'pt-6' : 'pt-36 sm:pt-40'}`}>
      <SacredBackdrop variant="minimal" stars={30} />
      <div className="container-luxe relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-navy-900/50">
          <Link href={base ? '/admin/services' : '/'} className="hover:text-coral">{base ? 'Admin' : 'Home'}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={href('/astrology')} className="hover:text-coral">Astrology</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-coral/80">{eyebrow}</span>
        </nav>
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl lg:text-6xl text-balance">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-900/65 sm:text-lg text-pretty">{subtitle}</p>}
          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
