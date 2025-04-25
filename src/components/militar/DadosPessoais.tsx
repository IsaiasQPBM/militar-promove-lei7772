
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/utils/militarValidation";

interface DadosPessoaisProps {
  form: UseFormReturn<FormValues>;
}

const DadosPessoais = ({ form }: DadosPessoaisProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="nomeCompleto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="nomeGuerra"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome de Guerra</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome de guerra" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DadosPessoais;
