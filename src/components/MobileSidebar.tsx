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
                      ? "border border-emerald-100/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.66)_0%,rgba(172,244,210,0.42)_42%,rgba(198,202,255,0.34)_100%)] text-[#0f3344] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_20px_rgba(72,123,120,0.2)]"
                      : "text-[#153d4f]/80 hover:bg-white/20 hover:text-[#0d2d3d]"
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
