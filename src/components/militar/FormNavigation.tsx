
import React from "react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  activeTab: string;
  isLastTab: boolean;
  isFirstTab: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  activeTab,
  isLastTab,
  isFirstTab,
  isSubmitting,
  onPrevious,
  onNext,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center pt-4">
      <div className="flex space-x-2">
        {!isFirstTab && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onPrevious}
          >
            Anterior
          </Button>
        )}
        
        {!isLastTab && (
          <Button 
            type="button"
            onClick={onNext}
          >
            Próximo
          </Button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        {isLastTab && (
          <Button 
            type="submit" 
            className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar Militar"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
