import { NAV_GROUPS } from "../config/navGroups";

type AppNavProps = {
  activeNav: string | null;
  onSelectNav: (navId: string | null) => void;
};

export function AppNav({ activeNav, onSelectNav }: AppNavProps) {
  return (
    <nav
      className="sticky top-0 z-30 mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/90 p-2 shadow-lg backdrop-blur-md"
      aria-label="Section categories"
    >
      <button
        type="button"
        onClick={() => onSelectNav(null)}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
          activeNav === null
            ? "bg-slate-800 text-slate-100"
            : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
        }`}
      >
        All
      </button>
      {NAV_GROUPS.map((g) => (
        <button
          key={g.id}
          type="button"
          onClick={() => onSelectNav(g.id)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeNav === g.id
              ? "bg-slate-800 text-slate-100"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
          }`}
        >
          {g.label}
        </button>
      ))}
    </nav>
  );
}
