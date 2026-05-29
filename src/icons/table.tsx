// ═══════════════════════════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════════════════════════

export const IC = {
  Search: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M15 15l3 3" strokeLinecap="round" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  ),
  ChevronUp: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M10 7.293l6.354 6.353-1.415 1.415L10 10.12l-4.94 4.94-1.413-1.414L10 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M10 12.707L3.646 6.354l1.415-1.415L10 9.879l4.94-4.94 1.413 1.414L10 12.707z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Columns: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <rect x="2" y="4" width="6" height="12" rx="1" />
      <rect x="12" y="4" width="6" height="12" rx="1" />
    </svg>
  ),
  Spinner: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5 animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
    </svg>
  ),
  DotsVertical: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  ),
  Eye: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="w-3.5 h-3.5"
    >
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="w-3.5 h-3.5"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-9.5 9.5a2 2 0 01-.878.514l-3 .75a.5.5 0 01-.607-.607l.75-3a2 2 0 01.514-.878l9.893-9.087z" />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="w-3.5 h-3.5"
    >
      <path
        d="M6 6l.5 9h7L14 6M4 6h12M8 6V4h4v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Filter: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <path d="M3 5h14M6 10h8M9 15h2" strokeLinecap="round" />
    </svg>
  ),
  Database: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <ellipse cx="10" cy="5" rx="7" ry="2.5" />
      <path d="M3 5v10c0 1.38 3.134 2.5 7 2.5S17 16.38 17 15V5" />
      <path d="M3 10c0 1.38 3.134 2.5 7 2.5S17 11.38 17 10" />
    </svg>
  ),
  FirstPage: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M4 5h2v10H4V5zm3.293 9.707l4.95-4.95a1 1 0 000-1.414l-4.95-4.95A1 1 0 005.88 5.807v8.386a1 1 0 001.413.514z" />
    </svg>
  ),
  LastPage: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M16 5h-2v10h2V5zm-3.293 9.707l-4.95-4.95a1 1 0 010-1.414l4.95-4.95a1 1 0 011.413.514v8.386a1 1 0 01-1.413.514z" />
    </svg>
  ),
  EmptyBox: () => (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      className="w-12 h-12"
    >
      <path d="M6 16l18-8 18 8v16l-18 8L6 32V16z" />
      <path d="M6 16l18 8 18-8" />
      <path d="M24 24v16" />
    </svg>
  ),
} as const;
