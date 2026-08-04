/* Shared, atomic UI primitives — LoadingSpinner, ErrorMessage, EmptyState */

export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <svg
        className="w-6 h-6 text-brand-500 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="text-sm text-ink-tertiary">{text}</p>
    </div>
  );
}

export function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
      <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-900/40 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm text-ink-secondary max-w-xs">{message}</p>
    </div>
  );
}

export function EmptyState({ icon = null, title = 'Nothing here', subtitle = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
      {icon && <span className="text-3xl opacity-40">{icon}</span>}
      <p className="font-display text-xl text-ink-primary">{title}</p>
      {subtitle && <p className="text-sm text-ink-tertiary max-w-xs">{subtitle}</p>}
    </div>
  );
}
