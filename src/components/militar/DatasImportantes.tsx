
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/utils/militarValidation";
import { normalizeDateInput } from "@/utils/dateValidation";

interface DatasImportantesProps {
  form: UseFormReturn<FormValues>;
}

const DatasImportantes = ({ form }: DatasImportantesProps) => {
  const handleDateInput = (input: string, fieldName: keyof FormValues) => {
    const formatted = normalizeDateInput(input);
    form.setValue(fieldName, formatted, { shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="dataNascimento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Nascimento</FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/AAAA" 
                {...field}
                maxLength={10}
                onChange={(e) => {
                  handleDateInput(e.target.value, "dataNascimento");
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dataInclusao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Inclusão</FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/AAAA" 
                {...field}
                maxLength={10}
                onChange={(e) => {
                  handleDateInput(e.target.value, "dataInclusao");
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dataUltimaPromocao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data da Última Promoção</FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/AAAA" 
                {...field}
                maxLength={10}
                onChange={(e) => {
                  handleDateInput(e.target.value, "dataUltimaPromocao");
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DatasImportantes;
