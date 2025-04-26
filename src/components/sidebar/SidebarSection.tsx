
import { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  return (
    <div className="mb-6">
      <div className="bg-purple-900 text-center py-2 mb-2 font-bold">
        {title}
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};
