import Link from 'next/link';
import type { ReactNode } from 'react';
import EnquireButton from './EnquireButton';

type ActionButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export function ActionButton({
  children,
  href,
  variant = 'primary',
  className = '',
  type = 'button',
}: ActionButtonProps) {
  const baseClassName =
    'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B] focus-visible:ring-offset-2';
  const variantClassName =
    variant === 'primary'
      ? 'bg-[#002B8B] text-white hover:bg-[#001F66] shadow-sm'
      : 'border border-[#002B8B] bg-white text-[#002B8B] hover:bg-[#002B8B] hover:text-white';

  const buttonClassName = `${baseClassName} ${variantClassName} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClassName}>
      {children}
    </button>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  descriptionClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  descriptionClassName = '',
  as = 'h2',
}: SectionHeadingProps) {
  const isCentered = align === 'center';
  const HeadingTag = as;

  return (
    <div className={isCentered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'}>
      {eyebrow && (
        <p className="mb-4 inline-flex rounded-full bg-[#E7F0FD] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#002B8B]">
          {eyebrow}
        </p>
      )}
      <HeadingTag className="text-gradient-brand text-3xl font-semibold tracking-[0.01em] md:text-4xl">
        {title}
      </HeadingTag>
      {description && (
        <p className={`mt-3 text-sm text-slate-600 md:text-base ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}

type StatsGridProps = {
  stats: Array<{
    value: string;
    label: string;
    icon: ReactNode;
  }>;
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 rounded-2xl bg-[#EAF4FD] p-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-4 rounded-xl bg-white/40 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#002B8B] shadow-sm">
            {item.icon}
          </div>
          <div>
            <h2 className="text-gradient-brand text-xl font-bold md:text-2xl">{item.value}</h2>
            <p className="text-sm text-slate-600">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

type CtaBannerProps = {
  title: string;
  description: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export function CtaBanner({
  title,
  description,
  secondaryHref,
}: CtaBannerProps) {
  return (
    <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-[#EAF4FD] p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-gradient-brand text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-slate-600 md:text-base">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <EnquireButton />
        {secondaryHref && (
          <ActionButton href={secondaryHref} variant="secondary" className=" text-[#002B8B] hover:bg-[#002B8B] hover:text-black">
            Call Now
          </ActionButton>
        )}
      </div>
    </div>
  );
}
