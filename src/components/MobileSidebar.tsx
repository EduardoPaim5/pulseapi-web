import { NavLink } from "react-router-dom";
import { navigationItems } from "../layouts/navigation";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-[#050b18]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative h-full w-72 p-4">
        <div className="glass-panel h-full p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-cyan-50/70">PulseAPI</div>
              <div className="text-xl font-semibold font-display text-cyan-50">Monitoring Console</div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-cyan-100/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(171,223,245,0.24)_100%)] px-3 py-1 text-xs uppercase tracking-wide text-white/90"
            >
              Close
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border border-cyan-100/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(152,218,245,0.3)_100%)] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_20px_rgba(0,76,116,0.24)]"
                      : "text-cyan-50/75 hover:bg-white/10 hover:text-cyan-50"
                  }`
                }
              >
                <item.icon />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default MobileSidebar;
