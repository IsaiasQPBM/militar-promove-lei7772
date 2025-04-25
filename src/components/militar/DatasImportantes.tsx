
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/utils/militarValidation";
import { useState, useEffect } from "react";

interface DatasImportantesProps {
  form: UseFormReturn<FormValues>;
}

const DatasImportantes = ({ form }: DatasImportantesProps) => {
  const formatDateInput = (input: string, fieldName: keyof FormValues) => {
    // Only process if input has content
    if (!input) return;
    
    // Remove non-digit characters
    let digits = input.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    digits = digits.substring(0, 8);
    
    // Format as DD/MM/YYYY
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.substring(0, Math.min(2, digits.length));
      if (digits.length > 2) {
        formatted += '/' + digits.substring(2, Math.min(4, digits.length));
        if (digits.length > 4) {
          formatted += '/' + digits.substring(4, 8);
        }
      }
    }
    
    // Update the form value
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
                  formatDateInput(e.target.value, "dataNascimento");
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
                  formatDateInput(e.target.value, "dataInclusao");
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
                  formatDateInput(e.target.value, "dataUltimaPromocao");
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
