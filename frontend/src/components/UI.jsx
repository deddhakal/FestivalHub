/* Shared, atomic UI primitives — LoadingSpinner, ErrorMessage, EmptyState, Skeleton */

export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
      <svg
        className="w-8 h-8 text-brand-500 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="text-fluid-base text-ink-tertiary">{text}</p>
    </div>
  );
}

export function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4" role="alert" aria-live="assertive">
      <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shadow-soft">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-fluid-base text-ink-secondary max-w-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ icon = null, title = 'Nothing here', subtitle = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
      {icon && <span className="text-4xl opacity-50 mb-2" aria-hidden="true">{icon}</span>}
      <p className="font-display text-fluid-xl text-ink-primary font-bold">{title}</p>
      {subtitle && <p className="text-fluid-base text-ink-tertiary max-w-sm">{subtitle}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-surface-muted rounded-xl ${className}`} aria-hidden="true" />
  );
}
