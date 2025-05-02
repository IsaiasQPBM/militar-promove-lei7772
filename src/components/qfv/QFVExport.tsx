
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { QFVDataByQuadro } from "@/types/qfv";

interface QFVExportProps {
  qfvData: QFVDataByQuadro;
}

const QFVExport = ({ qfvData }: QFVExportProps) => {
  // Função para ordenar os postos corretamente
  const ordenarPostos = (a: any, b: any) => {
    const ordemPostos = [
      "Coronel", "Tenente-Coronel", "Major", "Capitão", "1º Tenente", "2º Tenente",
      "Subtenente", "1º Sargento", "2º Sargento", "3º Sargento", "Cabo", "Soldado"
    ];
    
    return ordemPostos.indexOf(a.posto) - ordemPostos.indexOf(b.posto);
  };
  
  // Função para exportar os dados para CSV
  const exportarDadosCSV = () => {
    try {
      // Cabeçalho do CSV
      let csv = "Quadro,Posto,Vagas Previstas em Lei,Vagas Ocupadas,Vagas Disponíveis\n";
      
      // Adicionar dados de cada quadro
      Object.entries(qfvData).forEach(([quadro, dados]) => {
        dados.sort(ordenarPostos).forEach(item => {
          const linha = `${quadro},${item.posto},${item.vagasLei},${item.vagasOcupadas},${item.vagasDisponiveis}\n`;
          csv += linha;
        });
      });
      
      // Criar e forçar download do arquivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `QFV_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso."
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => window.open("https://www.pi.gov.br/leis/lei-no-7-772-de-13-de-outubro-de-2022/", "_blank")}
      >
        <FileText className="h-4 w-4" />
        Lei nº 7.772/2022
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={exportarDadosCSV}
      >
        <Download className="h-4 w-4" />
        Exportar Dados
      </Button>
    </div>
  );
};

export default QFVExport;
