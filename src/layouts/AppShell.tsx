import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import Topbar from "../components/Topbar";

type AppShellProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  children: ReactNode;
};

const AppShell = ({ title, subtitle, actions, breadcrumb, children }: AppShellProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 px-4 py-4 lg:px-6 lg:py-6">
        <div className="glass-panel h-full flex flex-col p-4 lg:p-6">
          <Topbar
            title={title}
            subtitle={subtitle}
            actions={actions}
            breadcrumb={breadcrumb}
            onOpenNavigation={() => setMobileNavOpen(true)}
          />
          <main className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
