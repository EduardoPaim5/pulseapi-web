import { demoMode } from "../demo/mode";
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
          {demoMode ? (
            <aside aria-label="Demonstração" className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cyan-50/95 px-4 py-3 text-sm text-slate-950">
              <p>Demonstração com dados fictícios. Alterações duram até recarregar; nenhum endereço é consultado.</p>
              <a href="/login?demo=0" className="shrink-0 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Sair da demonstração</a>
            </aside>
          ) : null}
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
