import { NavLink } from "react-router-dom";
import { navigationItems } from "../layouts/navigation";

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <aside className={`hidden lg:flex lg:flex-col lg:w-64 px-4 py-6 ${className ?? ""}`}>
      <div className="glass-panel p-4 flex flex-col gap-6">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-50/70">PulseAPI</div>
          <div className="text-xl font-semibold font-display text-cyan-50">Monitoring Console</div>
        </div>
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
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
  );
};

export default Sidebar;
