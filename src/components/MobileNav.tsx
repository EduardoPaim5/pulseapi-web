import { NavLink } from "react-router-dom";
import { AlertIcon, DashboardIcon, MonitorIcon, ProfileIcon } from "./icons";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/monitors", label: "Monitors", icon: MonitorIcon },
  { to: "/alerts", label: "Alerts", icon: AlertIcon },
  { to: "/profile", label: "Profile", icon: ProfileIcon },
];

const MobileNav = () => {
  return (
    <div className="lg:hidden glass-panel p-3 mb-4">
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 text-[11px] font-semibold ${
                isActive ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
              }`
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
