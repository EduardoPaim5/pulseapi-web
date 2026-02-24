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
  );
};

export default Sidebar;
