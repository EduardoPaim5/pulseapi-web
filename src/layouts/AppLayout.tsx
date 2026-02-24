import React from "react";
import AppShell from "./AppShell";

type AppLayoutProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ title, subtitle, actions, breadcrumb, children }) => {
  return (
    <AppShell title={title} subtitle={subtitle} actions={actions} breadcrumb={breadcrumb}>
      {children}
    </AppShell>
  );
};

export default AppLayout;
