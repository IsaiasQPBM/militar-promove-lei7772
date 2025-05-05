
import { toast } from "@/components/ui/use-toast";

export const handleFeatureRemoved = (featureName: string) => {
  toast({
    title: "Funcionalidade removida",
    description: `A funcionalidade "${featureName}" foi removida conforme solicitação.`,
    variant: "destructive",
    duration: 5000,
  });
};
