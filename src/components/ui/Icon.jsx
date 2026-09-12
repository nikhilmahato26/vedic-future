import * as Icons from '../../utils/icons';

/**
 * Resolves an icon by name from our centralized registry.
 * Usage: <Icon name="Stars" className="h-6 w-6" />
 *
 * Note: the wildcard import here is of OUR OWN curated registry
 * (a handful of named exports), NOT the full icon library — so it
 * stays tree-shake friendly and avoids bundle bloat.
 */
export default function Icon({ name, className = 'h-6 w-6', ...props }) {
  const Cmp = Icons[name];
  if (!Cmp) return null;
  return <Cmp className={className} aria-hidden="true" {...props} />;
}
