
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/utils/militarValidation";

interface DatasImportantesProps {
  form: UseFormReturn<FormValues>;
}

const DatasImportantes = ({ form }: DatasImportantesProps) => {
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
