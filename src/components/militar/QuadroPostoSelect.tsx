
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/utils/militarValidation";

interface QuadroPostoSelectProps {
  form: UseFormReturn<FormValues>;
  selectedQuadro: string;
  setSelectedQuadro: (value: string) => void;
}

const QuadroPostoSelect = ({ form, selectedQuadro, setSelectedQuadro }: QuadroPostoSelectProps) => {
  const getPostoOptions = () => {
    if (selectedQuadro === "QOEM" || selectedQuadro === "QOE" || selectedQuadro === "QORR") {
      return [
        { value: "Coronel", label: "Coronel" },
        { value: "Tenente-Coronel", label: "Tenente-Coronel" },
        { value: "Major", label: "Major" },
        { value: "Capitão", label: "Capitão" },
        { value: "1º Tenente", label: "1º Tenente" },
        { value: "2º Tenente", label: "2º Tenente" }
      ];
    } else {
      return [
        { value: "Subtenente", label: "Subtenente" },
        { value: "1º Sargento", label: "1º Sargento" },
        { value: "2º Sargento", label: "2º Sargento" },
        { value: "3º Sargento", label: "3º Sargento" },
        { value: "Cabo", label: "Cabo" },
        { value: "Soldado", label: "Soldado" }
      ];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="quadro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quadro de Pertencimento</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedQuadro(value);
                form.setValue("posto", "");
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o quadro" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="QOEM">QOEM - Estado-Maior</SelectItem>
                <SelectItem value="QOE">QOE - Especialistas</SelectItem>
                <SelectItem value="QORR">QORR - Reserva Remunerada (Oficiais)</SelectItem>
                <SelectItem value="QPBM">QPBM - Praças</SelectItem>
                <SelectItem value="QPRR">QPRR - Reserva Remunerada (Praças)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="posto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Posto/Graduação</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={!selectedQuadro}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={selectedQuadro ? "Selecione o posto/graduação" : "Selecione o quadro primeiro"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getPostoOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default QuadroPostoSelect;
