import {
  AlertIcon,
  DashboardIcon,
  MonitorIcon,
  ProfileIcon,
} from "../components/icons";

export const navigationItems = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/monitors", label: "Monitors", icon: MonitorIcon },
  { to: "/alerts", label: "Alerts", icon: AlertIcon },
  { to: "/profile", label: "Profile", icon: ProfileIcon },
];
