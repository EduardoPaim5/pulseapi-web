import React from "react";

type CardProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

const Card = ({ title, className, children }: CardProps) => {
  return (
    <div className={`glass-card p-5 ${className ?? ""}`}>
      {title ? (
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-50">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
};

export default Card;
