
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/utils/militarValidation";
import DadosPessoais from "./DadosPessoais";
import DatasImportantes from "./DatasImportantes";
import SituacaoEmail from "./SituacaoEmail";

interface FormTabsProps {
  form: UseFormReturn<FormValues>;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const FormTabs = ({ form, activeTab, setActiveTab }: FormTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
        <TabsTrigger value="datas">Datas Importantes</TabsTrigger>
        <TabsTrigger value="situacao-contato">Situação e Contato</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dados-pessoais" className="space-y-4">
        <DadosPessoais form={form} />
      </TabsContent>
      
      <TabsContent value="datas" className="space-y-4">
        <DatasImportantes form={form} />
      </TabsContent>
      
      <TabsContent value="situacao-contato" className="space-y-4">
        <SituacaoEmail form={form} />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
