
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";

interface MilitarSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddMilitar: () => void;
}

export const MilitarSearchFilter: React.FC<MilitarSearchFilterProps> = ({ 
  searchTerm, 
  setSearchTerm,
  handleAddMilitar
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar militar..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1" /> Filtrar
        </Button>
        <Button 
          onClick={handleAddMilitar} 
          className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
        >
          <Plus className="h-4 w-4 mr-1" /> Novo Militar
        </Button>
      </div>
    </div>
  );
};
