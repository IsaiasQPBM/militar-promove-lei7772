
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
            disabled={isSubmitting}
          >
            Anterior
          </Button>
        )}
        
        {!isLastTab && (
          <Button 
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
          >
            Próximo
          </Button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        {isLastTab && (
          <Button 
            type="submit" 
            className="bg-cbmepi-purple hover:bg-cbmepi-darkPurple"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar Militar"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
