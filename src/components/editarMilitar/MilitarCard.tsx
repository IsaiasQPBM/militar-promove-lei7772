
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import React, { ReactNode } from "react";

interface MilitarCardProps {
  children: ReactNode;
  title?: string;
}

const MilitarCard: React.FC<MilitarCardProps> = ({ 
  children, 
  title = "Atualizar Dados" 
}) => {
  return (
    <Card>
      <CardHeader className="bg-cbmepi-purple text-white">
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default MilitarCard;
