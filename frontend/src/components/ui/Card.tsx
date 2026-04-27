import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  description?: string;
  interactive?: boolean;
  title?: string;
};

export function Card({
  children,
  className = '',
  description,
  interactive = false,
  title,
  ...props
}: CardProps) {
  return (
    <section
      className={`card ${interactive ? 'card--interactive' : ''} ${className}`.trim()}
      {...props}
    >
      {(title || description) && (
        <header className="card__header">
          <div>
            {title ? <h2 className="card__title">{title}</h2> : null}
            {description ? <p className="card__description">{description}</p> : null}
          </div>
        </header>
      )}
      {children}
    </section>
  );
}
