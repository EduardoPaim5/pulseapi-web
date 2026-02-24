import type { ReactNode } from "react";

type PageSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

const PageSection = ({ title, description, action, children }: PageSectionProps) => {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? <p className="text-xs text-white/60">{description}</p> : null}
        </div>
        {action ? <div className="flex items-center gap-2">{action}</div> : null}
      </div>
      {children}
    </section>
  );
};

export default PageSection;
